"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingText = "Sending…" }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn block" disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Hidden from people; bots tend to fill it in. */
export function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
