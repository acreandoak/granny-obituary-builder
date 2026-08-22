#!/usr/bin/env python3
"""Improve cutouts: remove large white margins from rectangular scan crops."""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CUTOUTS = ROOT / "public" / "cutouts"


def trim_white(bgr: np.ndarray, thresh: int = 245) -> np.ndarray:
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    mask = gray < thresh
    ys, xs = np.where(mask)
    if len(xs) < 50:
        return bgr
    pad = 4
    y0, y1 = max(0, ys.min() - pad), min(bgr.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(bgr.shape[1], xs.max() + pad)
    return bgr[y0:y1, x0:x1]


def main() -> None:
    for path in sorted(CUTOUTS.glob("*.jpg")):
        img = cv2.imread(str(path))
        if img is None:
            continue
        trimmed = trim_white(img)
        rgb = cv2.cvtColor(trimmed, cv2.COLOR_BGR2RGB)
        Image.fromarray(rgb).save(path, "JPEG", quality=92, optimize=True)
        print(path.name, img.shape[:2], "->", trimmed.shape[:2])


if __name__ == "__main__":
    main()
