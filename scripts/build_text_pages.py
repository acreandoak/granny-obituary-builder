#!/usr/bin/env python3
"""Build corrected blank-text page seeds from OCR JSON (Vision coords → canvas)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OCR = ROOT / "scripts" / "ocr_out"
OUT = ROOT / "src" / "data" / "textPages.ts"

from hand_pages import HAND  # noqa: E402

PAGE_W, PAGE_H = 816, 1056

# Exact phrase fixes (OCR mistakes → correct booklet text)
FIXES = [
    (r"\bLaila\b", "Kaila"),
    (r"Laila-Fams", "Kaila-Isms"),
    (r"\bCributes\b", "Tributes"),
    (r"o/ributes", "Tributes"),
    (r"\bReara\b", "Keara"),
    (r"\bUnde\b", "Uncle"),
    (r"Aunti Nella", "Auntie Nella"),
    (r"May 29, 19%", "May 29, 1996"),
    (r"musir", "music"),
    (r"plaving", "playing"),
    (r"haskothall", "basketball"),
    (r"\bvoung\b", "young"),
    (r"Pearland flames", "Pearland Flames"),
    (r"Al since", "A1 since"),
    (r"Tribute\"", "Tribute"),
    (r"reserve any of it", "reverse any of it"),
]

# Noise lines to drop (photo watermarks, junk)
DROP = re.compile(
    r"^(PARLAND|314|Soft Music\.?|Donald Reynolds.*)$|^\d{1,3}$"
)


def fix_text(s: str) -> str:
    s = s.strip()
    for pat, rep in FIXES:
        s = re.sub(pat, rep, s)
    # clean leader dots spam
    s = re.sub(r"\.{2,}", " … ", s)
    s = re.sub(r"\s{2,}", " ", s)
    return s.strip(" .")


def vision_to_canvas(x: float, y: float, w: float, h: float, pad: float = 2):
    """Vision bottom-left → canvas top-left pixels."""
    cx = x * PAGE_W - pad
    cy = (1 - y - h) * PAGE_H - pad
    cw = w * PAGE_W + pad * 2
    ch = h * PAGE_H + pad * 2
    return {
        "x": round(max(0, cx), 1),
        "y": round(max(0, cy), 1),
        "width": round(min(PAGE_W, cw), 1),
        "height": round(min(PAGE_H, ch), 1),
    }


def guess_font(text: str, h: float, page: int) -> tuple[str, int, str]:
    """Return fontFamily key, fontSize, color."""
    t = text.lower()
    scriptish = any(
        k in t
        for k in (
            "celebrating",
            "kaila marie",
            "order of service",
            "beautiful life",
            "tribute",
            "tributes",
            "kaila-isms",
            "parents",
            "kasei",
            "granny",
            "keara",
            "sunrise",
            "sunset",
        )
    ) or (h > 0.04 and len(text) < 40)
    if scriptish and h > 0.035:
        size = max(28, min(72, int(h * PAGE_H * 0.85)))
        return ("script", size, "#5b2d8e" if page != 1 else "#1c1916")
    if h > 0.028 and len(text) < 60:
        size = max(18, min(36, int(h * PAGE_H * 0.75)))
        return ("script", size, "#5b2d8e")
    size = max(13, min(20, int(h * PAGE_H * 0.9)))
    return ("serif", size, "#1c1916")


def load_items(n: int) -> list[dict]:
    path = OCR / f"page-{n:02d}.json"
    if not path.exists():
        return []
    items = json.loads(path.read_text())
    out = []
    for i in items:
        text = fix_text(i["text"])
        if not text or DROP.match(text):
            continue
        # drop lone page numbers that OCR grabbed from footer if we add our own
        if re.fullmatch(r"\d{1,2}", text):
            continue
        box = vision_to_canvas(i["x"], i["y"], i["w"], i["h"])
        font, size, color = guess_font(text, i["h"], n)
        out.append(
            {
                "content": text,
                **box,
                "font": font,
                "fontSize": size,
                "color": color,
                "align": "center" if i["x"] > 0.25 and i["x"] + i["w"] < 0.85 and i["w"] < 0.55 else "left",
                "_vy": i["y"] + i["h"],  # top in vision space for sort
                "_vx": i["x"],
            }
        )
    out.sort(key=lambda b: (-b["_vy"], b["_vx"]))
    for b in out:
        b.pop("_vy", None)
        b.pop("_vx", None)
    return out


def merge_body_lines(blocks: list[dict], min_lines: int = 3) -> list[dict]:
    """Merge consecutive similar-width left-aligned body lines into paragraphs."""
    if len(blocks) < min_lines:
        return blocks
    merged: list[dict] = []
    buf: list[dict] = []

    def flush():
        nonlocal buf
        if not buf:
            return
        if len(buf) == 1:
            merged.append(buf[0])
        else:
            content = " ".join(b["content"] for b in buf)
            # cleanup hyphenation-ish joins
            content = re.sub(r"\s+", " ", content)
            x = min(b["x"] for b in buf)
            y = min(b["y"] for b in buf)
            r = max(b["x"] + b["width"] for b in buf)
            btm = max(b["y"] + b["height"] for b in buf)
            merged.append(
                {
                    "content": content,
                    "x": x,
                    "y": y,
                    "width": r - x,
                    "height": btm - y,
                    "font": "serif",
                    "fontSize": buf[0]["fontSize"],
                    "color": buf[0]["color"],
                    "align": "left",
                }
            )
        buf = []

    for b in blocks:
        is_body = (
            b["font"] == "serif"
            and b["fontSize"] <= 20
            and b["align"] == "left"
            and b["width"] > 280
            and len(b["content"]) > 40
        )
        if is_body:
            if buf:
                prev = buf[-1]
                gap = b["y"] - (prev["y"] + prev["height"])
                same_col = abs(b["x"] - prev["x"]) < 30
                if gap < 28 and same_col:
                    buf.append(b)
                    continue
                flush()
            buf = [b]
        else:
            flush()
            merged.append(b)
    flush()
    return merged


def page_bg(n: int) -> str:
    if n in (1, 3):
        return "#ebe4f2"
    return "#ffffff"


def page_name(n: int) -> str:
    names = {
        1: "Cover",
        2: "Order of Service",
        3: "Kaila-Isms",
        4: "A Beautiful Life",
        5: "Obituary continued",
        6: "Photo page",
        7: "Tribute — Parents",
        8: "Tribute — Sister",
        9: "Photo page",
        10: "Tributes",
        11: "Photo page",
        12: "Tributes",
        13: "Photo page",
        14: "Photo page",
        15: "Photo memories",
        16: "Photo page",
        17: "Photo memories",
        18: "Photo page",
        19: "Photo page",
        20: "Full page photo",
    }
    return names.get(n, f"Page {n}")


def main() -> None:
    pages = []
    for n in range(1, 21):
        if n in HAND:
            blocks = HAND[n]
        else:
            blocks = merge_body_lines(load_items(n))
            # Correct known title mistakes after merge
            for b in blocks:
                b["content"] = fix_text(b["content"])
                if b["content"] in {"Tribute", "Tributes", "Order of Service", "A Beautiful Life", "Kaila-Isms", "Parents", "Kasei", "Granny"}:
                    b["font"] = "script"
                    b["color"] = "#5b2d8e"

        # Photo-heavy pages with almost no text: still include page number only
        show_num = n not in (1, 20)
        pages.append(
            {
                "page": n,
                "name": page_name(n),
                "background": page_bg(n),
                "showPageNumber": show_num,
                "pageNumberPosition": "bl",
                "blocks": blocks,
            }
        )
        print(f"page {n:02d}: {len(blocks)} text blocks")

    # Write TS
    fonts = {
        "script": '"Great Vibes", "Segoe Script", cursive',
        "serif": '"Source Serif 4", "Iowan Old Style", Palatino, serif',
        "sans": '"Source Sans 3", "Helvetica Neue", Helvetica, Arial, sans-serif',
    }
    lines = [
        "/** Auto-generated blank-text pages from OCR + corrections. Re-run: python3 scripts/build_text_pages.py */",
        "export type TextBlockSeed = {",
        "  content: string",
        "  x: number",
        "  y: number",
        "  width: number",
        "  height: number",
        "  font: 'script' | 'serif' | 'sans'",
        "  fontSize: number",
        "  color: string",
        "  align: 'left' | 'center' | 'right' | 'justify'",
        "}",
        "export type TextPageSeed = {",
        "  page: number",
        "  name: string",
        "  background: string",
        "  showPageNumber: boolean",
        "  pageNumberPosition: 'bl' | 'br' | 'tl' | 'tr'",
        "  blocks: TextBlockSeed[]",
        "}",
        f"export const TEXT_FONTS = {json.dumps(fonts, indent=2)} as const",
        f"export const textPages: TextPageSeed[] = {json.dumps(pages, indent=2)}",
        "",
    ]
    OUT.write_text("\n".join(lines))
    print("wrote", OUT)


if __name__ == "__main__":
    main()
