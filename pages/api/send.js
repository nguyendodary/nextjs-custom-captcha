import { getSession, generateCaptchaImages, getDogIndexes } from "../../lib/session";

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((v, i) => v === sortedB[i]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  const captchaImages = session.captchaImages;

  if (!captchaImages || !Array.isArray(captchaImages)) {
    const newImages = generateCaptchaImages();
    const newKey = Date.now().toString(36) + Math.random().toString(36).slice(2);
    session.captchaImages = newImages;
    session.captchaKey = newKey;
    await session.save();
    return res.status(200).json({ sent: false, captchaIsOk: false });
  }

  const { message = "", selectedIndexes = [] } = req.body;
  const expectedDogIndexes = getDogIndexes(captchaImages);
  const captchaIsOk = arraysEqual(
    selectedIndexes.filter((i) => Number.isInteger(i) && i >= 0 && i <= 8),
    expectedDogIndexes
  );

  const newImages = generateCaptchaImages();
  const newKey = Date.now().toString(36) + Math.random().toString(36).slice(2);
  session.captchaImages = newImages;
  session.captchaKey = newKey;
  await session.save();

  return res.status(200).json({
    sent: captchaIsOk,
    captchaIsOk,
  });
}
