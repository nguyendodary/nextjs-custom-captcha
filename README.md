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
│   └── Captcha.js
├── lib/
│   └── session.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── api/
│       ├── captcha.js
│       ├── captcha-image.js
│       └── send.js
├── public/
│   └── dogs-and-muffins/   # dog1.png–dog10.png, muffin1.png–muffin13.png
├── styles/
│   └── globals.css
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
└── README.md
```

---

## Prerequisites: what you need to install

### Option A – Run locally (without Docker)

| Resource    | Purpose                          | How to install |
|------------|-----------------------------------|----------------|
| **Node.js** | Runtime for Next.js               | [nodejs.org](https://nodejs.org) (LTS). Includes `npm`. |
| **npm**     | Install dependencies, run scripts | Comes with Node.js. |

Check versions:

```bash
node -v   # e.g. v20.x
npm -v    # e.g. 10.x
```

### Option B – Run with Docker

| Resource   | Purpose                    | How to install |
|-----------|----------------------------|----------------|
| **Docker** | Build and run the app in a container | [docker.com](https://docs.docker.com/get-docker/) (Docker Engine). |
| **Docker Compose** (optional) | One-command run with `docker-compose` | Usually included with Docker Desktop; otherwise [Install Docker Compose](https://docs.docker.com/compose/install/). |

Check:

```bash
docker -v
docker compose version
```

### CAPTCHA images (required for both options)

Place these files in `public/dogs-and-muffins/`:

- **Dogs:** `dog1.png` … `dog10.png`
- **Muffins:** `muffin1.png` … `muffin13.png`

See `public/dogs-and-muffins/README.md` for details. If you clone the repo and the images are already there, you can skip this.

---

## How to run normally (without Docker)

### 1. Install dependencies

```bash
cd custom-captcha-nextjs
npm install
```

### 2. (Optional) Session secret for production

Create `.env.local` in the project root:

```env
SESSION_PASSWORD=your_secure_random_string_at_least_32_characters
```

If you omit this, a default is used (fine for local dev only).

### 3. Run the app

**Development** (with hot reload):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production** (build then start):

```bash
npm run build
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

---

## How to run using Docker

### Using Docker only (build + run)

1. **Build the image** (from the project root):

   ```bash
   cd custom-captcha-nextjs
   docker build -t custom-captcha-nextjs .
   ```

2. **Run the container**:

   ```bash
   docker run -p 3000:3000 --name captcha-app custom-captcha-nextjs
   ```

   With a custom session secret:

   ```bash
   docker run -p 3000:3000 -e SESSION_PASSWORD=your_secure_32_char_secret custom-captcha-nextjs
   ```

3. Open [http://localhost:3000](http://localhost:3000).

4. Stop and remove the container when done:

   ```bash
   docker stop captcha-app
   docker rm captcha-app
   ```

### Using Docker Compose (recommended)

1. **Start the app** (builds if needed, runs in background):

   ```bash
   cd custom-captcha-nextjs
   docker compose up -d
   ```

2. Open [http://localhost:3000](http://localhost:3000).

3. **Optional – set session secret** before `up`:

   Create a `.env` file in the project root:

   ```env
   SESSION_PASSWORD=your_secure_random_string_at_least_32_characters
   ```

   Then run:

   ```bash
   docker compose up -d
   ```

4. **Stop the app**:

   ```bash
   docker compose down
   ```

**Rebuild after code changes:**

```bash
docker compose up -d --build
```

---

## Behaviour

- **Frontend:** Form with message textarea, 3×3 image grid (click to select/unselect dogs), and Send button. Selected cells show a blue overlay.
- **Images:** Served via `/api/captcha-image?index=0..8` (and `captchaKey`). Filenames are not exposed in the URL.
- **Session:** iron-session stores captcha data in an encrypted cookie.
- **CAPTCHA:** 9 random images (50% dog, 50% muffin per slot). User must select all dog images to pass.
- **Validation:** `POST /api/send` with `{ message, selectedIndexes }` returns `{ sent, captchaIsOk }`. Captcha is regenerated after every attempt.

## API summary

| Endpoint             | Method | Purpose |
|----------------------|--------|--------|
| `/api/captcha`       | GET    | Create new captcha, return `{ captchaKey }` |
| `/api/captcha-image` | GET    | Serve image for `index` (0–8) |
| `/api/send`          | POST   | Body: `{ message, selectedIndexes }` → `{ sent, captchaIsOk }` |
