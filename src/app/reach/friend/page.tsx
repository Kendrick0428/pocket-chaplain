import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { PersonalContact } from "@/components/PersonalContact";

export const metadata: Metadata = { title: "Reach a Friend" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Reach a Friend</h1>
      <p className="page-intro">Add someone you trust: a partner, a classmate from the academy, a family member. Call or text opens your phone's own screen, so you confirm before anything happens.</p>
      <PersonalContact storageKey="pc.contact.friend" role="friend" />
      <p className="small muted" style={{ marginTop: 20 }}>Sometimes the best help is a friend who picks up. This app makes it easier to reach out; it doesn't replace friendship, counseling, or emergency services.</p>
    </div>
  );
}
