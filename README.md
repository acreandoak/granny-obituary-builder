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

Anyone can open the booklet builder here (works off your Wi‑Fi):

**https://acreandoak.github.io/granny-obituary-builder/**

Note: that site includes the family photos in the project. Anyone with the link can view them.

Vercel could not deploy right now — the Hobby team is blocked for fair-use limits. Fix that in the [Vercel dashboard](https://vercel.com/dashboard) if you want a Vercel URL later.

Your layout edits are still only in your browser until you click **Save file** and they click **Load file**.

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
