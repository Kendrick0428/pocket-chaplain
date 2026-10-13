"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/reach/chaplain", label: "Reach a Chaplain" },
  { href: "/pocket-chaplain", label: "Pocket Chaplain" },
  { href: "/prayer", label: "Prayer" },
  { href: "/resources", label: "Resources" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader({ appName, departmentName }: { appName: string; departmentName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label={`${appName}, home`}>
          <Logo size={44} />
          <span>
            {appName}
            <small>{departmentName}</small>
          </span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-nav" className="site-nav" aria-label="Main" data-open={open}>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
