# Memorial Booklet

Editable memorial booklet built from real family scans and photos.

The app opens with **your current booklet already loaded** (baked into `public/default-booklet.json`). Anyone who opens it for the first time sees that layout — no Save/Load handoff required unless they want a backup.

## Run on your computer

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/

## Share (private)

This repo is **private**. Photos and the booklet are not on a public website.

### Option A — Invite them on GitHub

1. Repo → **Settings** → **Collaborators** → **Add people**
2. They accept, then:

```bash
git clone git@github.com:acreandoak/granny-obituary-builder.git
cd granny-obituary-builder
npm install
npm run dev
```

They get your booklet preloaded on first open.

### Option B — Desktop zip

Send `~/Desktop/granny-obituary-builder-share.zip` (or rebuild it). They unzip, then:

```bash
npm install
npm run dev
```

Same preloaded booklet.

### Handing edits back

They can still click **Save file**, send you the `.json`, and you **Load file**.

## Tips

- **Paste image** — copy from Freeform/Photos, then paste (images are compressed so the browser doesn’t crash).
- **Save file** often if you’re handing work back and forth.
- Print uses the browser print dialog (Save as PDF).
- **Reset** reloads the shared starter booklet.

## Library tabs

- **Photos** — family JPGs  
- **Pages** — full scans  
- **Cutouts / Decor** — pieces from the booklet  

## Notes

- No invented clip-art. Decorations come from the booklet scans.
- Autosave is per-browser; the shared default is only used when there is no local save yet.
- Updating what newcomers see: replace `public/default-booklet.json` with a fresh **Save file** export, commit, and have them pull (or rebuild the zip).
