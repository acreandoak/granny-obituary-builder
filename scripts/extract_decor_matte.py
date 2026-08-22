#!/usr/bin/env python3
"""High-quality booklet decor cutouts via paper-aware soft matting (no rembg)."""

from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCANS = ROOT / "public" / "scans"
OUT = ROOT / "public" / "cutouts"
OUT.mkdir(parents=True, exist_ok=True)

# Hand-tuned boxes from visual inspection of deskewed scans
CROPS: list[tuple[str, str, tuple[float, float, float, float], str]] = [
    ("cover-florals-top", "page-01.jpg", (0.22, 0.00, 0.98, 0.20), "floral"),
    ("cover-butterfly-left", "page-01.jpg", (0.02, 0.33, 0.20, 0.50), "butterfly"),
    ("cover-butterfly-right", "page-01.jpg", (0.76, 0.37, 0.97, 0.54), "butterfly"),
    ("cover-butterfly-bottom", "page-01.jpg", (0.01, 0.73, 0.26, 0.99), "butterfly"),
    ("oos-florals-left", "page-02.jpg", (0.00, 0.00, 0.40, 0.28), "floral"),
    ("oos-butterfly-nestled", "page-02.jpg", (0.22, 0.01, 0.48, 0.18), "butterfly"),
    ("oos-butterfly-right", "page-02.jpg", (0.70, 0.00, 0.99, 0.22), "butterfly"),
    ("isms-florals-left", "page-03.jpg", (0.00, 0.00, 0.34, 0.24), "floral"),
    ("isms-butterfly-right", "page-03.jpg", (0.68, 0.00, 0.99, 0.20), "butterfly"),
    ("isms-florals-bottom", "page-03.jpg", (0.52, 0.76, 0.99, 0.99), "floral"),
    ("life-florals-left", "page-04.jpg", (0.00, 0.00, 0.38, 0.26), "floral"),
    ("life-butterfly-right", "page-04.jpg", (0.76, 0.00, 0.99, 0.18), "butterfly"),
    ("obit-florals-left", "page-05.jpg", (0.00, 0.00, 0.32, 0.20), "floral"),
    ("obit-butterfly-right", "page-05.jpg", (0.76, 0.00, 0.99, 0.16), "butterfly"),
    ("page06-florals-left", "page-06.jpg", (0.00, 0.00, 0.40, 0.30), "floral"),
    ("page06-florals-right", "page-06.jpg", (0.60, 0.68, 0.99, 0.99), "floral"),
    ("tribute-florals-corner", "page-07.jpg", (0.58, 0.74, 0.99, 0.99), "floral"),
    ("sister-florals-left", "page-08.jpg", (0.00, 0.00, 0.34, 0.24), "floral"),
    ("page09-florals-left", "page-09.jpg", (0.00, 0.00, 0.40, 0.30), "floral"),
    ("page09-butterfly-right", "page-09.jpg", (0.68, 0.00, 0.99, 0.20), "butterfly"),
    ("tributes-florals-left", "page-10.jpg", (0.00, 0.00, 0.34, 0.24), "floral"),
    ("tributes-florals-right", "page-10.jpg", (0.55, 0.72, 0.99, 0.99), "floral"),
    ("page11-florals-left", "page-11.jpg", (0.00, 0.00, 0.42, 0.34), "floral"),
    ("page12-florals-left", "page-12.jpg", (0.00, 0.00, 0.38, 0.28), "floral"),
    ("page12-florals-right", "page-12.jpg", (0.52, 0.70, 0.99, 0.99), "floral"),
    ("page14-florals-left", "page-14.jpg", (0.00, 0.00, 0.38, 0.28), "floral"),
    ("page14-butterfly-right", "page-14.jpg", (0.70, 0.00, 0.99, 0.18), "butterfly"),
    ("page15-florals-corner", "page-15.jpg", (0.52, 0.78, 0.99, 0.995), "floral"),
]


def crop_norm(img: np.ndarray, box: tuple[float, float, float, float]) -> np.ndarray:
    h, w = img.shape[:2]
    x0, y0, x1, y1 = box
    return img[int(y0 * h) : int(y1 * h), int(x0 * w) : int(x1 * w)].copy()


def soft_paper_matte(bgr: np.ndarray) -> np.ndarray:
    """Return RGBA with soft alpha: paper → transparent, florals/butterflies stay."""
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    h, w = rgb.shape[:2]

    # Paper samples from borders (avoid content)
    border = np.concatenate(
        [
            rgb[:6, :].reshape(-1, 3),
            rgb[-6:, :].reshape(-1, 3),
            rgb[:, :6].reshape(-1, 3),
            rgb[:, -6:].reshape(-1, 3),
        ],
        axis=0,
    )
    # keep lightish border pixels for paper estimate
    bright = border[border.mean(axis=1) > 160]
    if len(bright) < 40:
        bright = border
    paper = np.median(bright, axis=0)

    dist = np.linalg.norm(rgb - paper, axis=2)
    sat = hsv[:, :, 1]
    val = hsv[:, :, 2]
    # chroma vs paper in a/b
    paper_lab = np.median(
        lab[:6, :6].reshape(-1, 3) if True else lab.reshape(-1, 3),
        axis=0,
    )
    # better paper lab from bright border
    lab_flat = lab.reshape(-1, 3)
    rgb_flat = rgb.reshape(-1, 3)
    mask_b = rgb_flat.mean(axis=1) > 170
    if mask_b.sum() > 50:
        paper_lab = np.median(lab_flat[mask_b], axis=0)
    chroma = np.linalg.norm(lab[:, :, 1:] - paper_lab[1:], axis=2)

    # Soft alpha: higher when far from paper OR saturated
    # map dist 12..55 → 0..1
    a_dist = np.clip((dist - 12) / 40.0, 0, 1)
    a_chr = np.clip((chroma - 4) / 22.0, 0, 1)
    a_sat = np.clip((sat - 25) / 55.0, 0, 1)
    # very light + low sat = paper
    paper_like = (val > 210) & (sat < 35) & (dist < 35)
    alpha = np.maximum(np.maximum(a_dist, a_chr * 0.85), a_sat * 0.9)
    alpha = np.clip(alpha, 0, 1)
    alpha[paper_like] = 0

    # Mild edge soften
    alpha_u8 = (alpha * 255).astype(np.uint8)
    alpha_u8 = cv2.GaussianBlur(alpha_u8, (3, 3), 0)

    # Morphological cleanup: kill isolated speckles, fill small holes in subject
    hard = (alpha_u8 > 40).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    hard = cv2.morphologyEx(hard, cv2.MORPH_OPEN, k)
    hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    alpha_u8 = np.minimum(alpha_u8, np.maximum(hard, (alpha_u8 * 0.35).astype(np.uint8)))

    rgba = np.dstack([rgb.astype(np.uint8), alpha_u8])
    return rgba


def trim(rgba: np.ndarray, pad: int = 6) -> np.ndarray:
    a = rgba[:, :, 3]
    ys, xs = np.where(a > 18)
    if len(xs) < 40:
        return rgba
    y0, y1 = max(0, ys.min() - pad), min(rgba.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(rgba.shape[1], xs.max() + pad)
    return rgba[y0:y1, x0:x1]


def quality_ok(rgba: np.ndarray, motif: str) -> bool:
    a = rgba[:, :, 3]
    if a.size == 0:
        return False
    opaque = (a > 160).mean()
    mid = ((a > 30) & (a <= 160)).mean()
    # butterflies should be compact subjects
    if motif == "butterfly" and opaque < 0.08:
        return False
    if opaque + mid < 0.12:
        return False
    # reject near-solid rectangles (failed matte)
    if opaque > 0.92 and mid < 0.02:
        return False
    return True


def preview_on_cream(rgba: np.ndarray, path: Path) -> None:
    """Composite on cream so we can visually QA transparency."""
    h, w = rgba.shape[:2]
    cream = np.full((h, w, 3), (244, 241, 234), np.uint8)
    a = rgba[:, :, 3:4].astype(np.float32) / 255.0
    rgb = rgba[:, :, :3].astype(np.float32)
    out = (rgb * a + cream.astype(np.float32) * (1 - a)).astype(np.uint8)
    Image.fromarray(out).save(path, "JPEG", quality=90)


def main() -> None:
    # wipe prior png decor
    for p in OUT.glob("*.png"):
        p.unlink()

    preview_dir = ROOT / "scripts" / "decor_preview"
    preview_dir.mkdir(exist_ok=True)
    for p in preview_dir.glob("*"):
        p.unlink()

    assets = []
    for name, page, box, motif in CROPS:
        img = cv2.imread(str(SCANS / page))
        if img is None:
            print("missing", page)
            continue
        piece = crop_norm(img, box)
        rgba = soft_paper_matte(piece)
        rgba = trim(rgba)
        if not quality_ok(rgba, motif):
            print("reject", name, f"opaque={(rgba[:,:,3]>160).mean():.2f}")
            continue
        out = OUT / f"{name}.png"
        Image.fromarray(rgba, "RGBA").save(out, "PNG", optimize=True)
        preview_on_cream(rgba, preview_dir / f"{name}.jpg")
        assets.append(
            {
                "id": name,
                "src": f"/cutouts/{name}.png",
                "name": name.replace("-", " "),
                "kind": "decoration",
                "motif": motif,
                "sourcePage": page,
            }
        )
        print(
            f"ok {name:28} {rgba.shape[1]:4}x{rgba.shape[0]:<4} "
            f"opa={(rgba[:,:,3]>160).mean():.2f} soft={((rgba[:,:,3]>30)&(rgba[:,:,3]<=160)).mean():.2f}"
        )

    photos = [
        {
            "id": p.stem,
            "src": f"/cutouts/{p.name}",
            "name": p.stem.replace("-", " "),
            "kind": "photo",
        }
        for p in sorted(OUT.glob("*.jpg"))
    ]
    pages = [
        {"id": p.stem, "src": f"/scans/{p.name}", "name": p.stem.replace("-", " ")}
        for p in sorted(SCANS.glob("page-*.jpg"))
    ]
    cutouts = assets + photos
    (SCANS / "manifest.json").write_text(json.dumps({"scans": pages, "cutouts": cutouts}, indent=2))
    (ROOT / "src" / "data" / "scanManifest.ts").write_text(
        "export type ScanAsset = { id: string; src: string; name: string; sourceFile?: string; kind?: string; motif?: string; sourcePage?: string }\n"
        f"export const scannedPages: ScanAsset[] = {json.dumps(pages, indent=2)}\n"
        f"export const scanCutouts: ScanAsset[] = {json.dumps(cutouts, indent=2)}\n"
    )
    print(f"\n{len(assets)} decorations → public/cutouts + scripts/decor_preview/")


if __name__ == "__main__":
    main()
