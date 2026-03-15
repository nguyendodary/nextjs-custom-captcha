import { getSession, generateCaptchaImages } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  const captchaImages = generateCaptchaImages();
  const captchaKey = Date.now().toString(36) + Math.random().toString(36).slice(2);

  session.captchaImages = captchaImages;
  session.captchaKey = captchaKey;
  await session.save();

  return res.status(200).json({ captchaKey });
}
