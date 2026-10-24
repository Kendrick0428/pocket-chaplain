"use client";

import { useId, useRef, useState } from "react";

const MAX_SIDE = 256;

/** Reads an image, shrinks it to at most 256px on the longest side, and returns a data URL. */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      // PNG keeps transparent backgrounds, which most badges have.
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be read as an image."));
    };
    img.src = url;
  });
}

export function BadgeUpload({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return setError("Please choose a PNG or JPEG image.");
    if (file.size > 2_000_000) return setError("Please choose an image under 2 MB.");
    try {
      setValue(await shrink(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That image couldn't be used.");
    }
  }

  return (
    <fieldset className="form-field">
      <legend>Department badge or logo <span className="muted">(optional)</span></legend>
      <span className="hint">Shown next to The Pocket Chaplain logo on the home page. PNG with a transparent background looks best.</span>
      <input type="hidden" name="departmentLogo" value={value} />
      <div className="badge-upload">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Current department badge" width={96} height={96} />
        ) : (
          <span className="badge-empty">No badge</span>
        )}
        <div className="btn-row">
          <label htmlFor={`${id}-file`} className="btn secondary small" style={{ cursor: "pointer" }}>
            {value ? "Replace image" : "Choose image"}
          </label>
          <input id={`${id}-file`} ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="sr-only" />
          {value && (
            <button type="button" className="btn danger small" onClick={() => { setValue(""); if (inputRef.current) inputRef.current.value = ""; }}>
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="form-error" role="alert" style={{ marginTop: 10 }}>{error}</p>}
      <span className="hint" style={{ marginTop: 8 }}>Press Save changes below to publish it.</span>
    </fieldset>
  );
}
