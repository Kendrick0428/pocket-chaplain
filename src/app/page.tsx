import Link from "next/link";
import { getContent } from "@/lib/store";
import { Logo } from "@/components/Icons";
import { DailyEncouragement } from "@/components/DailyEncouragement";
import { InstallPrompt } from "@/components/InstallPrompt";
import { DepartmentCard } from "@/components/DepartmentCard";
import { edition } from "@/lib/edition";
import {
  BellIcon, BookIcon, CheckInIcon, ChurchIcon, FriendIcon, HomeIcon, IdeaIcon, LeafIcon, LifebuoyIcon, PrayIcon, ShieldIcon, StarIcon,
} from "@/components/Icons";

export default async function Home() {
  const { encouragements, settings } = await getContent();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-logos">
            <Logo size={128} decorative={false} />
            {settings.departmentLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.departmentLogo} alt={`${settings.departmentName} badge`} width={112} height={112} className="dept-badge" />
            )}
          </div>
          <div>
            <p className="eyebrow">{edition.label ? `${settings.appName}: ${edition.label}` : settings.appName}</p>
            <h1>Support for those who serve.</h1>
            <p>Prayer, encouragement, and a quick way to reach your chaplain and the people you trust.</p>
          </div>
        </div>
      </section>

      <div className="container">
        <DailyEncouragement items={encouragements} />

        <h2 className="section-title" id="reach-heading">Reach someone</h2>
        <nav className="reach-grid" aria-labelledby="reach-heading">
          <Link href="/reach/chaplain" className="reach-btn">
            <span className="icon"><ShieldIcon size={26} /></span>
            <span><span className="t">Reach a Chaplain</span><span className="s">Call or text your department chaplain</span></span>
          </Link>
          <Link href="/reach/pastor" className="reach-btn">
            <span className="icon"><ChurchIcon size={26} /></span>
            <span><span className="t">Reach My Pastor</span><span className="s">Your own pastor, saved on this device</span></span>
          </Link>
          <Link href="/reach/friend" className="reach-btn">
            <span className="icon"><FriendIcon size={26} /></span>
            <span><span className="t">Reach a Friend</span><span className="s">Someone you trust, saved on this device</span></span>
          </Link>
        </nav>

        <h2 className="section-title" id="more-heading">Find a moment</h2>
        <nav className="tile-grid" aria-labelledby="more-heading">
          <Link href="/prayer" className="tile">
            <PrayIcon className="icon" size={28} />
            <span><span className="t">Prayer</span><span className="s">Send a private prayer request</span></span>
          </Link>
          <Link href="/pocket-chaplain" className="tile">
            <BookIcon className="icon" size={28} />
            <span><span className="t">Pocket Chaplain</span><span className="s">Prayers, scripture &amp; encouragement</span></span>
          </Link>
          <Link href="/pocket-chaplain/take-a-moment" className="tile">
            <LeafIcon className="icon" size={28} />
            <span><span className="t">Take a moment</span><span className="s">A one-minute pause and prayer</span></span>
          </Link>
          <Link href="/check-in" className="tile">
            <CheckInIcon className="icon" size={28} />
            <span><span className="t">How am I doing?</span><span className="s">A quick check-in, private to you</span></span>
          </Link>
          <Link href="/family" className="tile">
            <HomeIcon className="icon" size={28} />
            <span><span className="t">For families</span><span className="s">Prayers &amp; support for those at home</span></span>
          </Link>
          <Link href="/pocket-chaplain?topic=saved" className="tile">
            <StarIcon className="icon" size={28} />
            <span><span className="t">My saved prayers</span><span className="s">Favorites, kept on this device</span></span>
          </Link>
          <Link href="/reminder" className="tile">
            <BellIcon className="icon" size={28} />
            <span><span className="t">Daily reminder</span><span className="s">Today&apos;s encouragement, at your time</span></span>
          </Link>
          <Link href="/resources" className="tile">
            <LifebuoyIcon className="icon" size={28} />
            <span><span className="t">Resources</span><span className="s">Peer support, counseling &amp; more</span></span>
          </Link>
          <Link href="/share-an-idea" className="tile">
            <IdeaIcon className="icon" size={28} />
            <span><span className="t">Share an Idea</span><span className="s">Suggest a prayer, topic, or improvement</span></span>
          </Link>
        </nav>

        <InstallPrompt />

        <div style={{ marginTop: 24 }}>
          <DepartmentCard settings={settings} />
        </div>

        <section className="notice about-box" aria-label="About this app">
          <p>
            <strong>{settings.appName}</strong> helps you reach a real chaplain and other trusted people. It is here to
            support the chaplain&apos;s ministry, not replace it. It does not replace personal chaplain care, pastoral
            care, friendship, counseling, or emergency services. <Link href="/about">Learn more</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
