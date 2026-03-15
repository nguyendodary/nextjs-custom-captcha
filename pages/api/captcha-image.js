import fs from "fs";
import path from "path";
import { getSession } from "../../lib/session";

const IMAGE_DIR = path.join(process.cwd(), "public", "dogs-and-muffins");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const index = parseInt(req.query.index, 10);
  if (Number.isNaN(index) || index < 0 || index > 8) {
    return res.status(400).json({ error: "Invalid index" });
  }

  const session = await getSession(req, res);
  const captchaImages = session.captchaImages;

  if (!captchaImages || !Array.isArray(captchaImages) || !captchaImages[index]) {
    return res.status(400).json({ error: "No captcha data" });
  }

  const filename = captchaImages[index];
  const safePath = path.join(IMAGE_DIR, path.basename(filename));

  if (!safePath.startsWith(IMAGE_DIR)) {
    return res.status(400).json({ error: "Invalid path" });
  }

  if (!fs.existsSync(safePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  const buffer = fs.readFileSync(safePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", contentType);
  return res.send(buffer);
}
