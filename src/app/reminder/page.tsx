import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { Reminder } from "@/components/Reminder";
import { vapidPublicKey } from "@/lib/push";

export const metadata: Metadata = { title: "Daily reminder" };

export default function Page() {
  return (
    <div className="container narrow page stack">
      <BackLink />
      <h1>Daily reminder</h1>
      <p className="page-intro">
        Get today&apos;s encouragement once a day, at a time you choose. It&apos;s optional, and you can turn it off
        any time.
      </p>
      <Reminder publicKey={vapidPublicKey()} />
      <p className="small muted">
        We don&apos;t ask for your name, email, or phone number for reminders. See <Link href="/privacy">Privacy</Link>{" "}
        for details.
      </p>
    </div>
  );
}
