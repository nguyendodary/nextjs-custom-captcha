import { getIronSession } from "iron-session";

const SESSION_OPTIONS = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "captcha_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "lax",
  },
};

export async function getSession(req, res) {
  return getIronSession(req, res, SESSION_OPTIONS);
}

export const DOG_FILES = Array.from({ length: 10 }, (_, i) => `dog${i + 1}.png`);
export const MUFFIN_FILES = Array.from({ length: 13 }, (_, i) => `muffin${i + 1}.png`);

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCaptchaImages() {
  const images = [];
  for (let i = 0; i < 9; i++) {
    const isDog = Math.random() < 0.5;
    images.push(isDog ? randomChoice(DOG_FILES) : randomChoice(MUFFIN_FILES));
  }
  return images;
}

export function getDogIndexes(captchaImages) {
  const dogIndexes = [];
  for (let i = 0; i < captchaImages.length; i++) {
    if (captchaImages[i].startsWith("dog")) dogIndexes.push(i);
  }
  return dogIndexes;
}
