"use client";

import { useActionState } from "react";
import type { AdminState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";

type Action = (prev: AdminState, fd: FormData) => Promise<AdminState>;

/** Wraps a server action with a Save button and a saved/error message. */
export function AdminForm({ action, children, submitLabel = "Save changes" }: { action: Action; children: React.ReactNode; submitLabel?: string }) {
  const [state, formAction] = useActionState<AdminState, FormData>(action, { ok: false });
  return (
    <form action={formAction}>
      {children}
      <SaveFooter state={state} label={submitLabel} />
    </form>
  );
}

export function SaveFooter({ state, label }: { state: AdminState; label: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <SubmitButton pendingText="Saving…">{label}</SubmitButton>
      <p role="status" aria-live="polite" className="small" style={{ marginTop: 8, minHeight: "1.5em" }}>
        {state.error ? <span style={{ color: "var(--danger-text)" }}>{state.error}</span> : state.ok ? "✓ Saved. Changes are live." : ""}
      </p>
    </div>
  );
}
