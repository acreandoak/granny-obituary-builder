#!/usr/bin/env python3
"""Extract transparent cutouts + portrait from booklet scans; write asset manifest."""

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

LETTER_W, LETTER_H = 1275, 1650


def load(page: str) -> np.ndarray:
    img = cv2.imread(str(SCANS / page), cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"missing {page}")
    return img


def crop_norm(img: np.ndarray, x0: float, y0: float, x1: float, y1: float) -> np.ndarray:
    h, w = img.shape[:2]
    a, b = int(x0 * w), int(y0 * h)
    c, d = int(x1 * w), int(y1 * h)
    return img[max(0, b) : min(h, d), max(0, a) : min(w, c)].copy()


def to_rgba_knockout(bgr: np.ndarray, soft: int = 18) -> np.ndarray:
    """Knock out paper-like background to transparency."""
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    h, w = rgb.shape[:2]
    # Sample paper from corners
    corners = np.concatenate(
        [
            rgb[:12, :12].reshape(-1, 3),
            rgb[:12, -12:].reshape(-1, 3),
            rgb[-12:, :12].reshape(-1, 3),
            rgb[-12:, -12:].reshape(-1, 3),
        ],
        axis=0,
    )
    paper = np.median(corners, axis=0).astype(np.float32)
    dist = np.linalg.norm(rgb.astype(np.float32) - paper, axis=2)
    # Also treat very light pixels as paper
    light = rgb.mean(axis=2)
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    alpha[dist < soft] = 0
    alpha[(light > 235) & (dist < soft * 2.2)] = 0
    # Soft edge
    edge = (dist >= soft) & (dist < soft * 2.5)
    alpha[edge] = np.clip(((dist[edge] - soft) / (soft * 1.5)) * 255, 0, 255).astype(np.uint8)
    # Keep saturated purple/green content even if somewhat light
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    sat = hsv[:, :, 1]
    alpha[(sat > 45) & (dist > soft * 0.4)] = 255
    rgba = np.dstack([rgb, alpha])
    # Trim empty
    ys, xs = np.where(alpha > 10)
    if len(xs) > 20:
        pad = 2
        y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad)
        x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad)
        rgba = rgba[y0:y1, x0:x1]
    return rgba


def save_png(path: Path, rgba: np.ndarray) -> None:
    Image.fromarray(rgba, "RGBA").save(path, "PNG")


def save_jpg(path: Path, bgr: np.ndarray) -> None:
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    Image.fromarray(rgb).save(path, "JPEG", quality=92, optimize=True)


def main() -> None:
    cover = load("page-01.jpg")
    oos = load("page-02.jpg")
    life = load("page-04.jpg")
    tribute = load("page-07.jpg")
    sister = load("page-08.jpg")
    collage = load("page-15.jpg")

    specs = [
        # name, image, box, knockout
        ("cover-florals-tr", cover, (0.52, 0.00, 0.995, 0.30), True),
        ("cover-butterfly-l", cover, (0.02, 0.36, 0.22, 0.54), True),
        ("cover-butterfly-r", cover, (0.78, 0.40, 0.98, 0.56), True),
        ("cover-butterfly-bl", cover, (0.02, 0.82, 0.22, 0.98), True),
        ("cover-portrait", cover, (0.30, 0.30, 0.70, 0.68), False),
        ("oos-florals-tl", oos, (0.00, 0.00, 0.34, 0.28), True),
        ("oos-butterflies-tr", oos, (0.72, 0.02, 0.99, 0.22), True),
        ("life-florals-tl", life, (0.00, 0.00, 0.32, 0.24), True),
        ("life-butterfly-tr", life, (0.78, 0.01, 0.99, 0.16), True),
        ("tribute-parents-photo", tribute, (0.52, 0.28, 0.88, 0.68), False),
        ("tribute-parents-florals", tribute, (0.62, 0.78, 0.99, 0.99), True),
        ("tribute-sister-photo", sister, (0.28, 0.48, 0.72, 0.88), False),
        ("collage-a", collage, (0.03, 0.03, 0.33, 0.28), False),
        ("collage-b", collage, (0.35, 0.03, 0.65, 0.28), False),
        ("collage-c", collage, (0.67, 0.03, 0.97, 0.28), False),
        ("collage-feature", collage, (0.55, 0.45, 0.97, 0.92), False),
        ("collage-florals-br", collage, (0.55, 0.82, 0.99, 0.995), True),
    ]

    cutouts = []
    for name, img, box, knock in specs:
        piece = crop_norm(img, *box)
        if knock:
            rgba = to_rgba_knockout(piece)
            path = OUT / f"{name}.png"
            save_png(path, rgba)
            src = f"/cutouts/{name}.png"
        else:
            path = OUT / f"{name}.jpg"
            save_jpg(path, piece)
            src = f"/cutouts/{name}.jpg"
        cutouts.append(
            {
                "id": name,
                "src": src,
                "name": name.replace("-", " "),
                "kind": "decoration" if knock else "photo",
            }
        )
        print(name, "->", path.name, piece.shape[:2])

    # Also keep page refs
    pages = []
    for p in sorted(SCANS.glob("page-*.jpg")):
        pages.append({"id": p.stem, "src": f"/scans/{p.name}", "name": p.stem.replace("-", " ")})

    manifest = {"scans": pages, "cutouts": cutouts}
    (SCANS / "manifest.json").write_text(json.dumps(manifest, indent=2))
    (ROOT / "src" / "data" / "scanManifest.ts").write_text(
        "export type ScanAsset = { id: string; src: string; name: string; sourceFile?: string; kind?: string }\n"
        f"export const scannedPages: ScanAsset[] = {json.dumps(pages, indent=2)}\n"
        f"export const scanCutouts: ScanAsset[] = {json.dumps(cutouts, indent=2)}\n"
    )
    print(f"Wrote {len(cutouts)} cutouts")


if __name__ == "__main__":
    main()
