import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { TakeAMoment } from "@/components/TakeAMoment";

export const metadata: Metadata = { title: "Take a moment" };

const PRAYER =
  "Lord, I pause here with You. Quiet my mind and slow my heart. Take what I'm carrying right now and give me Your peace, enough for this moment and the next. Amen.";

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink href="/pocket-chaplain" label="Pocket Chaplain" />
      <h1>Take a moment</h1>
      <p className="page-intro">A short pause, a few slow breaths, and an optional prayer.</p>
      <TakeAMoment prayer={PRAYER} />
      <p className="small muted" style={{ marginTop: 20 }}>
        Still feeling unsettled? <Link href="/reach/chaplain">Reach your chaplain</Link>. This exercise is not medical
        care or therapy.
      </p>
    </div>
  );
}
