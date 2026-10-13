import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { PersonalContact } from "@/components/PersonalContact";

export const metadata: Metadata = { title: "Reach My Pastor" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Reach My Pastor</h1>
      <p className="page-intro">Keep your pastor's number one tap away. Call or text opens your phone's own screen, so you confirm before anything happens.</p>
      <PersonalContact storageKey="pc.contact.pastor" role="pastor" />
      <p className="small muted" style={{ marginTop: 20 }}>Your pastor knows you and your family. This app just makes it easier to reach out; it doesn't replace that relationship.</p>
    </div>
  );
}
