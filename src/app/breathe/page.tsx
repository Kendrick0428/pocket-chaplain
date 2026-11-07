import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { BreatheWithMe } from "@/components/BreatheWithMe";

export const metadata: Metadata = { title: "Breathe with me" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink href="/home" label="Home" />
      <h1>Breathe with me</h1>
      <p className="page-intro">
        Tap the circle and breathe along: in as it grows, out as it gets smaller. Works without a signal.
      </p>
      <BreatheWithMe />
      <p className="small muted" style={{ marginTop: 20 }}>
        Want a short prayer too? Try <Link href="/pocket-chaplain/take-a-moment">Take a moment</Link>. Still feeling
        unsettled? <Link href="/reach/chaplain">Reach your chaplain</Link>. This exercise is not medical care or
        therapy.
      </p>
    </div>
  );
}
