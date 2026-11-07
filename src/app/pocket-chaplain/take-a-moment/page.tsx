import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { TakeAMoment } from "@/components/TakeAMoment";

export const metadata: Metadata = { title: "Take a moment" };

const PRAYER =
  "Lord, I pause here with You. Quiet my mind and slow my heart. Take what I'm carrying right now and give me Your peace, enough for this moment and the next. Amen.";

const REFLECTION =
  "You paused. That matters. Whatever you're carrying, you don't have to carry all of it right now. Take what you need from this moment: a little more calm, a little more strength, and the reminder that you are not alone.";

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink href="/pocket-chaplain" label="Pocket Chaplain" />
      <h1>Take a moment</h1>
      <p className="page-intro">A short pause, a few slow breaths, and an optional prayer or closing thought.</p>
      <TakeAMoment prayer={PRAYER} reflection={REFLECTION} />
      <p className="small muted" style={{ marginTop: 20 }}>
        Still feeling unsettled? <Link href="/reach/chaplain">Reach your chaplain</Link>. This exercise is not medical
        care or therapy.
      </p>
    </div>
  );
}
