"use client";

import { useActionState, useState } from "react";
import { createAdminAccount, login, type AdminState } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Logo } from "@/components/Icons";

function EmailPasswordForm({ mode }: { mode: "signin" | "create" }) {
  const [state, action] = useActionState<AdminState, FormData>(mode === "signin" ? login : createAdminAccount, { ok: false });
  if (mode === "create" && state.ok) {
    return <p className="form-success" role="status">{state.message}</p>;
  }
  return (
    <form action={action}>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-field">
        <label htmlFor={`${mode}-email`}>Email</label>
        <input id={`${mode}-email`} name="email" type="email" autoComplete="email" required />
      </div>
      <div className="form-field">
        <label htmlFor={`${mode}-pw`}>{mode === "signin" ? "Password" : "Choose a password"}</label>
        {mode === "create" && <span className="hint">At least 12 characters.</span>}
        <input
          id={`${mode}-pw`}
          name="password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          minLength={mode === "create" ? 12 : undefined}
          required
        />
      </div>
      <SubmitButton pendingText={mode === "signin" ? "Signing in…" : "Creating…"}>
        {mode === "signin" ? "Sign in" : "Create my administrator account"}
      </SubmitButton>
    </form>
  );
}

function SharedPasswordForm({ previewPassword }: { previewPassword: boolean }) {
  const [state, action] = useActionState<AdminState, FormData>(login, { ok: false });
  return (
    <>
      <form action={action}>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <div className="form-field">
          <label htmlFor="admin-pw">Password</label>
          <input id="admin-pw" name="password" type="password" autoComplete="current-password" required />
        </div>
        <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
      </form>
      {previewPassword && (
        <p className="notice gold small" style={{ marginTop: 16 }}>
          Preview mode: no ADMIN_PASSWORD is set, so the temporary password is <code>pocket-chaplain-preview</code>.
          Set ADMIN_PASSWORD and SESSION_SECRET before sharing this app (see README).
        </p>
      )}
    </>
  );
}

export function LoginForm({ previewPassword, accounts }: { previewPassword: boolean; accounts: boolean }) {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  return (
    <div className="container narrow page">
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 16px" }}>
        <Logo size={112} decorative={false} />
      </div>
      <h1>{mode === "signin" ? "Administrator sign-in" : "Set up your administrator account"}</h1>
      <p className="page-intro">For authorized chaplain-team administrators only.</p>
      <div className="card">
        {accounts ? <EmailPasswordForm key={mode} mode={mode} /> : <SharedPasswordForm previewPassword={previewPassword} />}
        {accounts && (
          <p className="small muted" style={{ marginTop: 16, marginBottom: 0 }}>
            {mode === "signin" ? (
              <>
                First time here?{" "}
                <button type="button" className="linklike" onClick={() => setMode("create")}>Set up your account</button>{" "}
                (your email must already be on the administrator list).
              </>
            ) : (
              <>
                Already set up? <button type="button" className="linklike" onClick={() => setMode("signin")}>Sign in</button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
