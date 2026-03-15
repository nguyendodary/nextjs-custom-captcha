# custom-captcha-nextjs

A CAPTCHA system where users must select all images of **dogs** in a 3×3 grid before submitting a message form. Built with Next.js (pages router), React, and iron-session.

## Tech stack

- **Next.js** (pages router)
- **React**
- **iron-session** (encrypted session cookies)
- **CSS Grid**
- **Node.js** `fs` module (API routes)

## Folder structure

```
custom-captcha-nextjs/
├── components/
│   └── Captcha.js          # 3×3 grid captcha UI
├── lib/
│   └── session.js          # iron-session config, captcha generation helpers
├── pages/
│   ├── _app.js             # App wrapper, global CSS
│   ├── index.js            # Home page with message form + captcha
│   └── api/
│       ├── captcha.js      # GET: generate captcha, return captchaKey
│       ├── captcha-image.js # GET: serve image by index (no filenames in URL)
│       └── send.js         # POST: validate, return { sent, captchaIsOk }
├── public/
│   └── dogs-and-muffins/   # dog1.png–dog10.png, muffin1.png–muffin13.png
├── styles/
│   └── globals.css         # Layout and captcha styles
├── next.config.js
├── package.json
└── README.md
```

## Installation

1. **Clone or copy** the project into a folder and open a terminal in that folder.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Add CAPTCHA images** into `public/dogs-and-muffins/`:
   - **Dogs:** `dog1.png` … `dog10.png`
   - **Muffins:** `muffin1.png` … `muffin13.png`

   See `public/dogs-and-muffins/README.md` for details.

4. **Optional – session secret (recommended in production):**

   Create a `.env.local` file in the project root:

   ```env
   SESSION_PASSWORD=your_secure_random_string_at_least_32_characters
   ```

   If omitted, a default in-code password is used (fine for local dev only).

## Run instructions

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Submit the form by selecting all dog images and clicking Send.

**Production build:**

```bash
npm run build
npm start
```

## Behaviour

- **Frontend:** Form with message textarea, 3×3 image grid (click to select/unselect dogs), and Send button. Selected cells get a blue overlay.
- **Images:** Served via `/api/captcha-image?index=0..8` (and `captchaKey`). Real filenames are never exposed in the URL.
- **Session:** iron-session stores `captchaImages` (and `captchaKey`) in an encrypted cookie.
- **CAPTCHA generation:** 9 images chosen at random with 50% dog / 50% muffin per slot from the dataset above.
- **Validation:** `POST /api/send` with `{ message, selectedIndexes }`. Server compares `selectedIndexes` with the indexes of dog images and returns `{ sent, captchaIsOk }`. Captcha is regenerated after every attempt (and on validation failure).
- **Security:** No caching of captcha images (dynamic `captchaKey` and no-store headers); new captcha after each submit.

## API summary

| Endpoint              | Method | Purpose |
|-----------------------|--------|--------|
| `/api/captcha`        | GET    | Create new captcha, store in session, return `{ captchaKey }` |
| `/api/captcha-image`  | GET    | Serve image for `index` (0–8); requires valid session |
| `/api/send`           | POST   | Body: `{ message, selectedIndexes }` → `{ sent, captchaIsOk }`; regenerates captcha |
