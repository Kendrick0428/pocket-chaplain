import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { getContent } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { EmergencyNotice } from "@/components/EmergencyNotice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "The Pocket Chaplain", template: "%s · The Pocket Chaplain" },
  description:
    "Support for those who serve. Prayer, encouragement, and easy access to chaplain support for law enforcement officers, staff, and their families.",
  metadataBase: new URL("https://thepocketchaplain.com"),
  applicationName: "The Pocket Chaplain",
  appleWebApp: { capable: true, title: "Pocket Chaplain", statusBarStyle: "black-translucent" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1730",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();

  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {settings.prototypeMode && (
          <div className="proto-banner" role="note">
            <strong>Prototype preview.</strong> Please don&apos;t enter real personal, case, or incident information yet.
          </div>
        )}
        <SiteHeader appName={settings.appName} departmentName={settings.departmentName} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            <EmergencyNotice />
            <ul className="footer-links">
              <li><Link href="/about">About this app</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/share-an-idea">Share an Idea</Link></li>
              <li><Link href="/admin">Administrator sign-in</Link></li>
            </ul>
            <p className="small" style={{ margin: 0 }}>
              {settings.appName} helps you reach a real chaplain and other trusted people. It does not replace personal
              chaplain care, pastoral care, friendship, counseling, or emergency services.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
