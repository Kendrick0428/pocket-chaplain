import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { RESOURCE_CATEGORIES } from "@/lib/types";
import { BackLink } from "@/components/BackLink";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { ResourceCard } from "@/components/ResourceCard";

export const metadata: Metadata = { title: "Resources" };

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
              items.map((r) => <ResourceCard key={r.id} r={r} />)
            )}
          </section>
        );
      })}
    </div>
  );
}
