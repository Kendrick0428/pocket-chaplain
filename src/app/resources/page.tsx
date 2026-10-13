import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { RESOURCE_CATEGORIES } from "@/lib/types";
import { isUsablePhone, smsHref, telHref } from "@/lib/phone";
import { BackLink } from "@/components/BackLink";
import { WithPlaceholders } from "@/components/Placeholder";
import { LinkIcon, PhoneIcon, TextIcon } from "@/components/Icons";
import { EmergencyNotice } from "@/components/EmergencyNotice";

export const metadata: Metadata = { title: "Resources" };

function safeUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export default async function Resources() {
  const { resources } = await getContent();

  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Resources</h1>
      <p className="page-intro">Support for you and your family, from people who understand this work.</p>
      <EmergencyNotice />

      <nav aria-label="Resource categories" className="chips" style={{ marginTop: 20 }}>
        {RESOURCE_CATEGORIES.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            {c.label}
          </a>
        ))}
      </nav>

      {RESOURCE_CATEGORIES.map((cat) => {
        const items = resources.filter((r) => r.category === cat.id);
        return (
          <section key={cat.id} id={cat.id} className="res-group" aria-labelledby={`${cat.id}-h`}>
            <h2 id={`${cat.id}-h`}>{cat.label}</h2>
            {items.length === 0 ? (
              <p className="muted">No resources listed yet.</p>
            ) : (
              items.map((r) => {
                const url = r.url ? safeUrl(r.url) : null;
                return (
                  <article key={r.id} className="card res">
                    <h3><WithPlaceholders text={r.name} /></h3>
                    {r.hours && <p className="small muted" style={{ marginBottom: 6 }}><WithPlaceholders text={r.hours} /></p>}
                    <p style={{ marginBottom: 0 }}><WithPlaceholders text={r.description} /></p>
                    {(isUsablePhone(r.phone) || isUsablePhone(r.text) || url) && (
                      <div className="btn-row">
                        {isUsablePhone(r.phone) && (
                          <a className="btn small" href={telHref(r.phone)}><PhoneIcon size={18} /> Call {r.phone}</a>
                        )}
                        {isUsablePhone(r.text) && (
                          <a className="btn small gold" href={smsHref(r.text)}><TextIcon size={18} /> Text {r.text}</a>
                        )}
                        {url && (
                          <a className="btn small secondary" href={url} target="_blank" rel="noopener noreferrer">
                            <LinkIcon size={18} /> Website<span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>
        );
      })}
    </div>
  );
}
