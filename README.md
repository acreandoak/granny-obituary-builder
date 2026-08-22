# Memorial Booklet

Editable memorial booklet built from real family scans and photos.

## Run on your computer

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/

## Share your booklet with someone else

Your layout is saved in **your** browser. To hand it off:

1. Open the booklet and click **Save file** (downloads a `.json` backup).
2. Send that file (email, text, AirDrop, Drive).
3. They open the same app, click **Load file**, and choose your `.json`.

They can edit, then **Save file** again and send it back to you.

### Share the app itself (code + photos)

This project lives in a **private** GitHub repo. Invite them:

1. Open the repo on GitHub → **Settings** → **Collaborators** → **Add people**.
2. They accept the invite, then:

```bash
git clone <repo-url>
cd granny-obituary-builder
npm install
npm run dev
```

Or send them a zip of the project folder (without `node_modules`) and the same `npm install` / `npm run dev` steps.

### Live website link

A public web link means anyone with the URL can open the app (including family photos). If you want that, ask to deploy it (Vercel / Netlify) and we’ll set it up.

## Tips

- **Paste image** — copy from Freeform/Photos, then paste (images are compressed so the browser doesn’t crash).
- **Save file** often if you’re handing work back and forth.
- Print uses the browser print dialog (Save as PDF).

## Library tabs

- **Photos** — family JPGs  
- **Pages** — full scans  
- **Cutouts / Decor** — pieces from the booklet  

## Notes

- No invented clip-art. Decorations come from the booklet scans.
- Autosave is per-browser; **Save file** is how you move work between people and computers.
