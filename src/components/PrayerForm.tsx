"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitPrayerRequest, type FormState } from "@/app/actions";
import { Honeypot, SubmitButton } from "./SubmitButton";

export function PrayerForm() {
  const [state, action] = useActionState<FormState, FormData>(submitPrayerRequest, { ok: false });
  const [anonymous, setAnonymous] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) doneRef.current?.focus();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="form-success" ref={doneRef} tabIndex={-1} role="status">
        <h2>Your prayer request was received</h2>
        <p>Thank you for trusting us with it. The chaplain team will be praying with you.</p>
        <p style={{ margin: 0 }}>
          If you&apos;d like to talk with someone, <a href="/reach/chaplain">reach a chaplain</a>.
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}

      <div className="notice gold" style={{ marginBottom: 18 }} id="prayer-reminder">
        <p>
          <strong>Please keep it general.</strong> Don&apos;t include sensitive personnel, case, or incident information,
          or anything that could identify someone else. For example, “Please pray for strength after a hard week” works
          well.
        </p>
      </div>

      <div className="form-field">
        <label htmlFor="pr-request">Your prayer request</label>
        <textarea id="pr-request" name="request" required maxLength={1000} aria-describedby="prayer-reminder" />
      </div>

      <div className="form-field">
        <label className="choice">
          <input type="checkbox" name="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <span>
            <strong>Send anonymously</strong>
            <span>Your name won&apos;t be attached. The chaplain team won&apos;t be able to follow up with you.</span>
          </span>
        </label>
      </div>

      {!anonymous && (
        <div className="form-field">
          <label htmlFor="pr-name">Your first name <span className="muted">(optional)</span></label>
          <input id="pr-name" name="name" type="text" autoComplete="given-name" maxLength={80} />
        </div>
      )}

      <fieldset className="form-field">
        <legend>Who may see this request?</legend>
        <label className="choice">
          <input type="radio" name="visibility" value="chaplain" defaultChecked />
          <span>
            <strong>Chaplain team only</strong>
            <span>Only the authorized chaplain team will read it.</span>
          </span>
        </label>
        <label className="choice">
          <input type="radio" name="visibility" value="prayer-group" />
          <span>
            <strong>Chaplain team and an approved prayer group</strong>
            <span>The chaplain team may share it with a small, approved prayer group. It is never posted publicly.</span>
          </span>
        </label>
      </fieldset>

      <Honeypot />
      <SubmitButton>Send prayer request</SubmitButton>
      <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
        Prayer requests are never shown publicly. They are handled with care, but no online form can promise complete
        confidentiality. See <a href="/privacy">Privacy</a>.
      </p>
    </form>
  );
}
