# Memorial Booklet

Editable memorial booklet built from real family scans and photos.

**Live link (send this):** https://acreandoak.github.io/granny-obituary-builder/

Anyone who opens it gets your current booklet already loaded. Their edits stay in their browser until they **Save file** and send the `.json` back.

> Anyone with the link can view the family photos in this project.

## Run on your computer

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/

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
- Updating what newcomers see: replace `public/default-booklet.json` with a fresh **Save file** export, then push to `main`.
