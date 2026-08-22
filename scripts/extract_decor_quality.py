#!/usr/bin/env python3
"""Extract clean booklet decorations with rembg knockout + tight trim."""

from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
SCANS = ROOT / "public" / "scans"
OUT = ROOT / "public" / "cutouts"
OUT.mkdir(parents=True, exist_ok=True)

# Precise crops from deskewed letter scans (x0,y0,x1,y1) — decoration only, not photos.
# Named for the library.
CROPS: list[tuple[str, str, tuple[float, float, float, float], str]] = [
    # Cover
    ("cover-florals-top", "page-01.jpg", (0.18, 0.00, 0.95, 0.22), "floral"),
    ("cover-butterfly-left", "page-01.jpg", (0.03, 0.34, 0.18, 0.48), "butterfly"),
    ("cover-butterfly-right", "page-01.jpg", (0.78, 0.38, 0.96, 0.52), "butterfly"),
    ("cover-butterfly-bottom", "page-01.jpg", (0.02, 0.74, 0.24, 0.98), "butterfly"),
    # Order of Service
    ("oos-florals-left", "page-02.jpg", (0.00, 0.00, 0.38, 0.26), "floral"),
    ("oos-butterfly-left", "page-02.jpg", (0.28, 0.02, 0.48, 0.16), "butterfly"),
    ("oos-butterfly-right", "page-02.jpg", (0.72, 0.00, 0.99, 0.20), "butterfly"),
    # Kaila-Isms
    ("isms-florals-left", "page-03.jpg", (0.00, 0.00, 0.32, 0.22), "floral"),
    ("isms-butterfly-right", "page-03.jpg", (0.70, 0.00, 0.99, 0.18), "butterfly"),
    ("isms-florals-bottom", "page-03.jpg", (0.55, 0.78, 0.99, 0.99), "floral"),
    # Beautiful Life
    ("life-florals-left", "page-04.jpg", (0.00, 0.00, 0.36, 0.24), "floral"),
    ("life-butterfly-right", "page-04.jpg", (0.78, 0.00, 0.99, 0.16), "butterfly"),
    # Obituary continued
    ("obit-florals-left", "page-05.jpg", (0.00, 0.00, 0.30, 0.18), "floral"),
    ("obit-butterfly-right", "page-05.jpg", (0.78, 0.00, 0.99, 0.14), "butterfly"),
    # Photo page 6
    ("page06-florals-left", "page-06.jpg", (0.00, 0.00, 0.38, 0.28), "floral"),
    ("page06-florals-right", "page-06.jpg", (0.62, 0.70, 0.99, 0.99), "floral"),
    # Tribute parents
    ("tribute-florals-corner", "page-07.jpg", (0.60, 0.76, 0.99, 0.99), "floral"),
    # Tribute sister / tributes pages
    ("sister-florals-left", "page-08.jpg", (0.00, 0.00, 0.32, 0.22), "floral"),
    ("page09-florals-left", "page-09.jpg", (0.00, 0.00, 0.38, 0.28), "floral"),
    ("page09-butterfly-right", "page-09.jpg", (0.70, 0.00, 0.99, 0.18), "butterfly"),
    ("tributes-florals-left", "page-10.jpg", (0.00, 0.00, 0.32, 0.22), "floral"),
    ("tributes-florals-right", "page-10.jpg", (0.58, 0.74, 0.99, 0.99), "floral"),
    ("page11-florals-left", "page-11.jpg", (0.00, 0.00, 0.40, 0.32), "floral"),
    ("page12-florals-left", "page-12.jpg", (0.00, 0.00, 0.36, 0.26), "floral"),
    ("page12-florals-right", "page-12.jpg", (0.55, 0.72, 0.99, 0.99), "floral"),
    ("page14-florals-left", "page-14.jpg", (0.00, 0.00, 0.36, 0.26), "floral"),
    ("page14-butterfly-right", "page-14.jpg", (0.72, 0.00, 0.99, 0.16), "butterfly"),
    ("page15-florals-corner", "page-15.jpg", (0.55, 0.80, 0.99, 0.995), "floral"),
]


def crop_norm(img: np.ndarray, box: tuple[float, float, float, float]) -> np.ndarray:
    h, w = img.shape[:2]
    x0, y0, x1, y1 = box
    return img[int(y0 * h) : int(y1 * h), int(x0 * w) : int(x1 * w)].copy()


def paper_assist_mask(bgr: np.ndarray) -> np.ndarray:
    """1 = likely paper (to bias rembg / cleanup)."""
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    # sample corners
    h, w = rgb.shape[:2]
    corners = np.concatenate(
        [
            rgb[:8, :8].reshape(-1, 3),
            rgb[:8, -8:].reshape(-1, 3),
            rgb[-8:, :8].reshape(-1, 3),
            rgb[-8:, -8:].reshape(-1, 3),
        ]
    )
    paper = np.median(corners, axis=0)
    dist = np.linalg.norm(rgb - paper, axis=2)
    light = rgb.mean(axis=2)
    sat = hsv[:, :, 1]
    paperish = (dist < 28) | ((light > 225) & (sat < 40))
    return paperish.astype(np.uint8)


def trim_alpha(rgba: np.ndarray, pad: int = 4) -> np.ndarray:
    a = rgba[:, :, 3]
    ys, xs = np.where(a > 12)
    if len(xs) < 30:
        return rgba
    y0, y1 = max(0, ys.min() - pad), min(rgba.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(rgba.shape[1], xs.max() + pad)
    return rgba[y0:y1, x0:x1]


def cleanup_alpha(rgba: np.ndarray, paper_mask: np.ndarray) -> np.ndarray:
    """Force paper regions transparent; keep saturated content."""
    out = rgba.copy()
    a = out[:, :, 3].astype(np.float32)
    # erode tiny speckles
    bin_a = (a > 40).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    bin_a = cv2.morphologyEx(bin_a, cv2.MORPH_OPEN, k)
    a = np.minimum(a, bin_a.astype(np.float32))
    # kill paper
    a[paper_mask > 0] *= 0.05
    # boost opaque where rembg kept content
    a = np.clip(a, 0, 255)
    out[:, :, 3] = a.astype(np.uint8)
    return out


def extract_one(bgr: np.ndarray) -> np.ndarray | None:
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(rgb)
    # rembg — u2net is default, good for objects on plain-ish pages
    cut = remove(pil)
    rgba = np.array(cut.convert("RGBA"))
    paper = paper_assist_mask(bgr)
    # resize paper mask if needed (same size)
    if paper.shape[:2] != rgba.shape[:2]:
        paper = cv2.resize(paper, (rgba.shape[1], rgba.shape[0]), interpolation=cv2.INTER_NEAREST)
    rgba = cleanup_alpha(rgba, paper)
    rgba = trim_alpha(rgba)
    # reject empty / mostly empty
    if rgba.size == 0 or rgba[:, :, 3].mean() < 6:
        return None
    opaque = (rgba[:, :, 3] > 180).mean()
    if opaque < 0.04:
        return None
    return rgba


def main() -> None:
    # remove old decor pngs so library only has new quality set
    for p in OUT.glob("*.png"):
        # keep nothing — rebuild clean
        p.unlink()

    assets = []
    for name, page, box, motif in CROPS:
        path = SCANS / page
        img = cv2.imread(str(path))
        if img is None:
            print("missing", page)
            continue
        piece = crop_norm(img, box)
        if piece.size == 0:
            print("empty crop", name)
            continue
        print(f"extract {name}…", end=" ", flush=True)
        try:
            rgba = extract_one(piece)
        except Exception as e:
            print("FAIL", e)
            continue
        if rgba is None:
            print("reject")
            continue
        out = OUT / f"{name}.png"
        Image.fromarray(rgba, "RGBA").save(out, "PNG", optimize=True)
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
        print(f"ok {rgba.shape[1]}x{rgba.shape[0]} opaque%={(rgba[:,:,3]>180).mean()*100:.0f}")

    # keep photo jpgs that still exist
    photos = []
    for p in sorted(OUT.glob("*.jpg")):
        photos.append(
            {
                "id": p.stem,
                "src": f"/cutouts/{p.name}",
                "name": p.stem.replace("-", " "),
                "kind": "photo",
            }
        )

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
    print(f"\nDone: {len(assets)} decorations, {len(photos)} photos")


if __name__ == "__main__":
    main()
