import type { Metadata } from "next";
import Link from "next/link";
import { EmergencyNotice } from "@/components/EmergencyNotice";

export const metadata: Metadata = { title: "You're offline", robots: { index: false } };

/** Shown by the service worker when there's no signal and the page wasn't saved yet. */
export default function Offline() {
  return (
    <div className="container narrow page stack">
      <h1>No signal right now</h1>
      <p className="page-intro">This page hasn&apos;t been saved on your phone yet. These still work without a connection:</p>
      <ul className="suggest">
        <li><Link href="/pocket-chaplain">Pocket Chaplain prayers and readings</Link></li>
        <li><Link href="/pocket-chaplain/take-a-moment">Take a moment</Link></li>
        <li><Link href="/reach/pastor">Reach My Pastor</Link> and <Link href="/reach/friend">Reach a Friend</Link></li>
        <li><Link href="/check-in">How am I doing?</Link></li>
      </ul>
      <p>Forms such as prayer requests need a connection. Your phone can still make calls and send texts.</p>
      <EmergencyNotice />
    </div>
  );
}
