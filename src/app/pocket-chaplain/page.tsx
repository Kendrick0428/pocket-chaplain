import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import { BackLink } from "@/components/BackLink";
import { Library } from "@/components/Library";
import { LeafIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Pocket Chaplain" };

export default async function PocketChaplain({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const [{ library }, { topic }] = await Promise.all([getContent(), searchParams]);

  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Pocket Chaplain</h1>
      <p className="page-intro">Short prayers, scripture, reflections, and encouragement for the moments this work brings.</p>

      <Link href="/pocket-chaplain/take-a-moment" className="tile" style={{ marginBottom: 20 }}>
        <LeafIcon className="icon" size={28} />
        <span>
          <span className="t">Take a moment</span>
          <span className="s">A one-minute pause, a breathing prompt, and an optional prayer</span>
        </span>
      </Link>

      <Library entries={library} initialTopic={topic} />

      <div className="notice" style={{ marginTop: 24 }}>
        <p>
          Words on a screen can only go so far. If something is weighing on you, <Link href="/reach/chaplain">reach your chaplain</Link>,
          your pastor, or a friend.
        </p>
      </div>
    </div>
  );
}
