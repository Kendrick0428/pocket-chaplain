import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import { BackLink } from "@/components/BackLink";
import { Library } from "@/components/Library";
import { ResourceCard } from "@/components/ResourceCard";
import { WithPlaceholders } from "@/components/Placeholder";
import { PrayIcon, ShieldIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "For families" };

export default async function Family() {
  const { library, resources, settings } = await getContent();
  const entries = library.filter((e) => e.topics.includes("families"));
  const familyResources = resources.filter((r) => r.category === "family");

  return (
    <div className="container narrow page">
      <BackLink />
      <h1>For families</h1>
      <p className="page-intro">
        For the spouses, partners, children, and parents of those who serve with{" "}
        <WithPlaceholders text={settings.departmentName} />. This work touches your home too, and you deserve support.
      </p>

      <section aria-labelledby="fam-reach">
        <h2 id="fam-reach">The chaplain is here for you, too</h2>
        <div className="tile-grid two-col">
          <Link href="/reach/chaplain" className="tile">
            <ShieldIcon className="icon" size={28} />
            <span><span className="t">Reach a Chaplain</span><span className="s">Family members are welcome to call or text</span></span>
          </Link>
          <Link href="/prayer" className="tile">
            <PrayIcon className="icon" size={28} />
            <span><span className="t">Send a prayer request</span><span className="s">Privately, and anonymously if you like</span></span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="fam-prayers" style={{ marginTop: 28 }}>
        <h2 id="fam-prayers">Prayers and encouragement for families</h2>
        {entries.length > 0 ? (
          <Library entries={entries} showFilters={false} />
        ) : (
          <p className="muted">Family prayers will appear here soon.</p>
        )}
        <p className="small" style={{ marginTop: 12 }}>
          More in the <Link href="/pocket-chaplain?topic=family">Pocket Chaplain library</Link>, including prayers for
          family challenges.
        </p>
      </section>

      <section aria-labelledby="fam-res" className="res-group" style={{ marginTop: 28 }}>
        <h2 id="fam-res">Family resources</h2>
        {familyResources.length === 0 ? (
          <p className="muted">No family resources listed yet.</p>
        ) : (
          familyResources.map((r) => <ResourceCard key={r.id} r={r} />)
        )}
        <p className="small" style={{ marginTop: 12 }}>
          See all <Link href="/resources">resources</Link>, including counseling and crisis support.
        </p>
      </section>
    </div>
  );
}
