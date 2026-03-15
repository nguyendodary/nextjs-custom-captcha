import { useState, useEffect, useCallback } from "react";
import Captcha from "../components/Captcha";

export default function Home() {
  const [captchaKey, setCaptchaKey] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const loadCaptcha = useCallback(async () => {
    setResult(null);
    setSelectedIndexes([]);
    setCaptchaKey(null);
    const res = await fetch("/api/captcha", { credentials: "include" });
    const data = await res.json();
    if (res.ok && data.captchaKey) {
      setCaptchaKey(data.captchaKey);
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: message.trim(),
          selectedIndexes,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (!data.captchaIsOk) {
        await loadCaptcha();
      }
    } catch (err) {
      setResult({ sent: false, captchaIsOk: false });
      await loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <main className="main">
        <h1 className="title">Send a message</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="form__input form__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message…"
            rows={3}
            disabled={submitting}
          />
          <Captcha
            captchaKey={captchaKey}
            selectedIndexes={selectedIndexes}
            onSelect={setSelectedIndexes}
            disabled={submitting}
          />
          <button type="submit" className="form__submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send"}
          </button>
        </form>
        {result && (
          <div
            className={`result result--${result.captchaIsOk ? "ok" : "fail"}`}
            role="status"
          >
            {result.captchaIsOk
              ? "Message sent successfully."
              : "CAPTCHA failed. Please select all dogs and try again."}
          </div>
        )}
      </main>
    </div>
  );
}
