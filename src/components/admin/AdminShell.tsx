import Link from "next/link";
import { isAdmin, usingPreviewPassword } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase";
import { logout } from "@/app/admin/actions";
import { LoginForm } from "./LoginForm";

const TABS = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/chaplain", label: "Chaplain contact" },
  { href: "/admin/encouragements", label: "Daily encouragement" },
  { href: "/admin/library", label: "Pocket Chaplain library" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/settings", label: "Settings" },
];

/** Every admin page renders through this, so each page checks the session itself. */
export async function AdminShell({ current, children }: { current: string; children: React.ReactNode }) {
  if (!(await isAdmin())) return <LoginForm previewPassword={usingPreviewPassword()} accounts={supabaseConfigured} />;

  return (
    <div className="container page">
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Administration</h1>
        <form action={logout}>
          <button type="submit" className="btn secondary small">Sign out</button>
        </form>
      </div>
      <p className="small muted">
        Personal pastor and friend contacts are stored only on each officer&apos;s device and never appear here.
      </p>
      <nav className="admin-tabs" aria-label="Administration sections">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} aria-current={t.href === current ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
