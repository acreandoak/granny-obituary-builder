#!/usr/bin/env python3
"""Deskew Granny HEIC scans into letter pages + extract real rectangular assets."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path.home() / "Desktop" / "Granny"
SCANS = ROOT / "public" / "scans"
CUTOUTS = ROOT / "public" / "cutouts"
TMP = Path("/tmp/granny-obit-work")

LETTER_W, LETTER_H = 1275, 1650  # 150 dpi letter


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True)


def heic_to_jpeg(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "90", str(src), "--out", str(dst)])


def order_points(pts: np.ndarray) -> np.ndarray:
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect


def find_page_quad(img: np.ndarray) -> np.ndarray | None:
    h, w = img.shape[:2]
    scale = 900 / max(h, w)
    small = cv2.resize(img, (int(w * scale), int(h * scale)))
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(gray, 40, 140)
    edges = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=2)
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:12]
    page_area = small.shape[0] * small.shape[1]
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        area = cv2.contourArea(approx)
        if len(approx) == 4 and area > page_area * 0.25:
            return (approx.reshape(4, 2) / scale).astype("float32")
    # fallback: content bounding box from bright paper
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (0, 0, 140), (180, 90, 255))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8), iterations=2)
    ys, xs = np.where(mask > 0)
    if len(xs) < 1000:
        return None
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    return np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], dtype="float32")


def warp_page(img: np.ndarray, quad: np.ndarray) -> np.ndarray:
    rect = order_points(quad)
    (tl, tr, br, bl) = rect
    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)
    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)
    maxW = max(int(widthA), int(widthB))
    maxH = max(int(heightA), int(heightB))
    dst = np.array([[0, 0], [maxW - 1, 0], [maxW - 1, maxH - 1], [0, maxH - 1]], dtype="float32")
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(img, M, (maxW, maxH))
    # Prefer portrait letter orientation
    if warped.shape[1] > warped.shape[0]:
        # phone landscape of a portrait page — rotate so tall side is height
        # pick rotation that keeps top text-ish brighter variance later; default CW/CCW by content
        cand1 = cv2.rotate(warped, cv2.ROTATE_90_CLOCKWISE)
        cand2 = cv2.rotate(warped, cv2.ROTATE_90_COUNTERCLOCKWISE)
        # Prefer the candidate whose top strip is lighter (often title/margins)
        def top_brightness(a: np.ndarray) -> float:
            strip = a[: max(20, a.shape[0] // 12)]
            return float(strip.mean())

        warped = cand1 if top_brightness(cand1) >= top_brightness(cand2) else cand2
    return warped


def to_letter(img: np.ndarray) -> np.ndarray:
    """Scale page to fill letter canvas (cover), then center-crop — no side bars."""
    h, w = img.shape[:2]
    target_ratio = LETTER_H / LETTER_W
    ratio = h / max(w, 1)
    if ratio > target_ratio:
        # too tall — fit width, crop height
        new_w = LETTER_W
        new_h = int(round(LETTER_W * ratio))
    else:
        # too wide — fit height, crop width
        new_h = LETTER_H
        new_w = int(round(LETTER_H / ratio))
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    y0 = max(0, (new_h - LETTER_H) // 2)
    x0 = max(0, (new_w - LETTER_W) // 2)
    return resized[y0 : y0 + LETTER_H, x0 : x0 + LETTER_W].copy()


def save_jpg(path: Path, bgr: np.ndarray, quality: int = 90) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    Image.fromarray(rgb).save(path, "JPEG", quality=quality, optimize=True)


def crop_norm(page: np.ndarray, x0: float, y0: float, x1: float, y1: float) -> np.ndarray:
    h, w = page.shape[:2]
    a, b = int(x0 * w), int(y0 * h)
    c, d = int(x1 * w), int(y1 * h)
    return page[b:d, a:c].copy()


def main() -> int:
    TMP.mkdir(parents=True, exist_ok=True)
    SCANS.mkdir(parents=True, exist_ok=True)
    CUTOUTS.mkdir(parents=True, exist_ok=True)

    heics = sorted(SRC.glob("IMG_89*.HEIC")) + sorted(SRC.glob("IMG_89* 2.HEIC"))
    # Deduplicate by stem base
    seen = set()
    files: list[Path] = []
    for p in sorted(SRC.iterdir()):
        if p.suffix.upper() != ".HEIC":
            continue
        if not p.name.startswith("IMG_89"):
            continue
        key = p.name.replace(" 2", "").replace(".HEIC", "")
        if key in seen:
            continue
        seen.add(key)
        files.append(p)
    files = sorted(files, key=lambda p: p.name)

    if len(files) < 15:
        print(f"Expected ~20 HEIC scans, found {len(files)}", file=sys.stderr)

    pages_meta = []
    for i, src in enumerate(files, start=1):
        raw = TMP / f"raw-{i:02d}.jpg"
        heic_to_jpeg(src, raw)
        img = cv2.imread(str(raw))
        if img is None:
            print("skip unreadable", src)
            continue
        quad = find_page_quad(img)
        if quad is None:
            warped = img
        else:
            warped = warp_page(img, quad)
        letter = to_letter(warped)
        out = SCANS / f"page-{i:02d}.jpg"
        save_jpg(out, letter)
        pages_meta.append(
            {
                "id": f"page-{i:02d}",
                "src": f"/scans/page-{i:02d}.jpg",
                "name": f"Scanned page {i}",
                "sourceFile": src.name,
            }
        )
        print(f"page {i:02d} <- {src.name}")

    # Real rectangular cutouts from known layouts (normalized coords on letter pages)
    cutout_specs = [
        # Cover portrait
        ("cover-portrait", 1, 0.30, 0.30, 0.70, 0.70),
        # Cover florals top-right region
        ("cover-florals-tr", 1, 0.55, 0.00, 0.98, 0.28),
        # Cover butterfly left
        ("cover-butterfly-l", 1, 0.05, 0.38, 0.22, 0.52),
        # Order of service florals TL
        ("oos-florals-tl", 2, 0.00, 0.00, 0.32, 0.28),
        ("oos-butterflies-tr", 2, 0.70, 0.02, 0.98, 0.22),
        # Beautiful life florals
        ("life-florals-tl", 4, 0.00, 0.00, 0.30, 0.24),
        ("life-butterfly-tr", 4, 0.78, 0.02, 0.98, 0.16),
        # Tribute parents photo
        ("tribute-parents-photo", 7, 0.52, 0.30, 0.88, 0.68),
        ("tribute-parents-florals", 7, 0.62, 0.78, 0.98, 0.98),
        # Sister tribute photo
        ("tribute-sister-photo", 8, 0.28, 0.48, 0.72, 0.88),
        # Photo collage tiles from a memory page (approx page 15 in our earlier mapping ~ page with many portraits)
        ("collage-a", 15, 0.03, 0.03, 0.33, 0.28),
        ("collage-b", 15, 0.35, 0.03, 0.65, 0.28),
        ("collage-c", 15, 0.67, 0.03, 0.97, 0.28),
        ("collage-feature", 15, 0.55, 0.45, 0.97, 0.92),
        ("collage-florals-br", 15, 0.55, 0.82, 0.98, 0.99),
        # Full bleed action page (last)
        ("full-bleed", len(pages_meta), 0.05, 0.05, 0.95, 0.95),
    ]

    cutouts_meta = []
    for name, page_i, x0, y0, x1, y1 in cutout_specs:
        page_path = SCANS / f"page-{page_i:02d}.jpg"
        if not page_path.exists():
            continue
        page = cv2.imread(str(page_path))
        if page is None:
            continue
        crop = crop_norm(page, x0, y0, x1, y1)
        if crop.size == 0:
            continue
        out = CUTOUTS / f"{name}.jpg"
        save_jpg(out, crop, quality=92)
        cutouts_meta.append({"id": name, "src": f"/cutouts/{name}.jpg", "name": name.replace("-", " "), "kind": "scan-cutout"})
        print("cutout", name)

    manifest = {
        "scans": pages_meta,
        "cutouts": cutouts_meta,
    }
    (SCANS / "manifest.json").write_text(json.dumps(manifest, indent=2))
    (ROOT / "src" / "data" / "scanManifest.ts").write_text(
        "export type ScanAsset = { id: string; src: string; name: string; sourceFile?: string; kind?: string }\n"
        f"export const scannedPages: ScanAsset[] = {json.dumps(pages_meta, indent=2)}\n"
        f"export const scanCutouts: ScanAsset[] = {json.dumps(cutouts_meta, indent=2)}\n"
    )
    print(f"Done: {len(pages_meta)} pages, {len(cutouts_meta)} cutouts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
