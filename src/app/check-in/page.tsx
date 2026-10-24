import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { CheckIn } from "@/components/CheckIn";

export const metadata: Metadata = { title: "How am I doing?" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink />
      <h1>How am I doing?</h1>
      <p className="page-intro">A quick, private check-in. Answer honestly and you&apos;ll get a few ideas for what might help today.</p>
      <p className="small muted">
        🔒 Your answers stay on this device. Nothing is sent to the chaplain or anyone else. This isn&apos;t a test or a
        diagnosis, and it isn&apos;t counseling or medical care.
      </p>
      <CheckIn />
    </div>
  );
}
