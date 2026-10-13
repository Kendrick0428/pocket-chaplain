import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/store";
import { IDEA_CATEGORIES, type Submission } from "@/lib/types";
import { changeSubmissionStatus, removeSubmission } from "./actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const KINDS = [
  { id: "all", label: "All" },
  { id: "followup", label: "Chaplain follow-ups" },
  { id: "prayer", label: "Prayer requests" },
  { id: "idea", label: "Ideas" },
] as const;

const KIND_LABEL: Record<Submission["kind"], string> = {
  followup: "Chaplain follow-up",
  prayer: "Prayer request",
  idea: "Idea",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function SubmissionCard({ s }: { s: Submission }) {
  return (
    <article className="card sub">
      <header>
        <span>
          <span className={`badge ${s.status === "new" ? "new" : ""}`}>{s.status}</span>{" "}
          <strong>{KIND_LABEL[s.kind]}</strong>
        </span>
        <span className="small muted">{fmt(s.createdAt)}</span>
      </header>

      {s.kind === "prayer" && (
        <>
          <p className="msg">{s.request}</p>
          <dl>
            <dt>From</dt><dd>{s.anonymous ? "Anonymous" : s.name || "(no name given)"}</dd>
            <dt>Sharing</dt>
            <dd>{s.visibility === "prayer-group" ? "May share with approved prayer group" : "Chaplain team only"}</dd>
          </dl>
        </>
      )}
      {s.kind === "idea" && (
        <>
          <p className="msg">{s.idea}</p>
          <dl>
            <dt>Type</dt><dd>{IDEA_CATEGORIES.find((c) => c.id === s.category)?.label}</dd>
            <dt>From</dt><dd>{s.anonymous ? "Anonymous" : s.name || "(no name given)"}</dd>
          </dl>
        </>
      )}
      {s.kind === "followup" && (
        <>
          {s.note && <p className="msg">{s.note}</p>}
          <dl>
            <dt>Name</dt><dd>{s.name}</dd>
            <dt>Prefers</dt><dd>{s.contactMethod}</dd>
            <dt>Contact</dt><dd>{s.contact}</dd>
            {s.bestTime && (<><dt>Best time</dt><dd>{s.bestTime}</dd></>)}
          </dl>
        </>
      )}

      <div className="btn-row" style={{ marginTop: 12 }}>
        {s.status !== "reviewed" && (
          <form action={changeSubmissionStatus}>
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="status" value="reviewed" />
            <button className="btn small" type="submit">Mark reviewed</button>
          </form>
        )}
        {s.status !== "archived" && (
          <form action={changeSubmissionStatus}>
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="status" value="archived" />
            <button className="btn secondary small" type="submit">Archive</button>
          </form>
        )}
        {s.status !== "new" && (
          <form action={changeSubmissionStatus}>
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="status" value="new" />
            <button className="btn secondary small" type="submit">Mark new</button>
          </form>
        )}
        <form action={removeSubmission}>
          <input type="hidden" name="id" value={s.id} />
          <ConfirmButton message="Permanently delete this submission?">Delete</ConfirmButton>
        </form>
      </div>
    </article>
  );
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ kind?: string; show?: string }> }) {
  const { kind = "all", show = "open" } = await searchParams;
  const subs = (await isAdmin()) ? await listSubmissions() : [];
  const filtered = subs.filter(
    (s) => (kind === "all" || s.kind === kind) && (show === "all" || (show === "open" ? s.status !== "archived" : s.status === "archived")),
  );
  const newCount = subs.filter((s) => s.status === "new").length;

  return (
    <AdminShell current="/admin">
      <h2>Submissions {newCount > 0 && <span className="badge new">{newCount} new</span>}</h2>
      <p className="small muted">
        Private to authorized administrators. Only share a prayer request with the approved prayer group if the sender
        chose that option.
      </p>
      <div className="chips" role="group" aria-label="Filter by type">
        {KINDS.map((k) => (
          <Link key={k.id} href={`/admin?kind=${k.id}&show=${show}`} className="chip" aria-pressed={kind === k.id}
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            {k.label}
          </Link>
        ))}
      </div>
      <div className="chips" role="group" aria-label="Filter by status" style={{ marginTop: -8 }}>
        {[{ id: "open", label: "Open" }, { id: "archived", label: "Archived" }, { id: "all", label: "Everything" }].map((o) => (
          <Link key={o.id} href={`/admin?kind=${kind}&show=${o.id}`} className="chip" aria-pressed={show === o.id}
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            {o.label}
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="muted">Nothing here.</p>
      ) : (
        <div className="res-group">{filtered.map((s) => <SubmissionCard key={s.id} s={s} />)}</div>
      )}
    </AdminShell>
  );
}
