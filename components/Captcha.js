import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 9;

export default function Captcha({ captchaKey, selectedIndexes, onSelect, disabled }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(t);
  }, [captchaKey]);

  const toggle = useCallback(
    (index) => {
      if (disabled) return;
      if (selectedIndexes.includes(index)) {
        onSelect(selectedIndexes.filter((i) => i !== index));
      } else {
        onSelect([...selectedIndexes, index]);
      }
    },
    [selectedIndexes, onSelect, disabled]
  );

  if (!captchaKey) {
    return (
      <div className="captcha captcha--loading">
        <p>Loading captcha…</p>
      </div>
    );
  }

  const query = new URLSearchParams({ captchaKey });
  const imageUrl = (index) => `/api/captcha-image?index=${index}&${query.toString()}`;

  return (
    <div className="captcha" role="group" aria-label="Select all images containing a dog">
      <p className="captcha__instruction">Select all images containing a dog</p>
      <div className="captcha__grid">
        {Array.from({ length: GRID_SIZE }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`captcha__cell ${selectedIndexes.includes(i) ? "captcha__cell--selected" : ""}`}
            onClick={() => toggle(i)}
            disabled={disabled}
            aria-pressed={selectedIndexes.includes(i)}
            aria-label={`Image ${i + 1}`}
          >
            {loading ? (
              <span className="captcha__placeholder" />
            ) : (
              <img
                src={imageUrl(i)}
                alt=""
                className="captcha__image"
                draggable={false}
              />
            )}
            {selectedIndexes.includes(i) && <span className="captcha__overlay" aria-hidden />}
          </button>
        ))}
      </div>
    </div>
  );
}
