import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { PrayerForm } from "@/components/PrayerForm";

export const metadata: Metadata = { title: "Prayer" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Prayer</h1>
      <p className="page-intro">
        Send a private prayer request to the chaplain team. You can include your name or send it anonymously.
      </p>
      <div className="card">
        <PrayerForm />
      </div>
      <p className="small muted" style={{ marginTop: 20 }}>
        Looking for words to pray right now? Visit <Link href="/pocket-chaplain">Pocket Chaplain</Link>.
      </p>
    </div>
  );
}
