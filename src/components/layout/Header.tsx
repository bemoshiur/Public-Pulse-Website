"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, ArrowUpRight } from "lucide-react";

// Primary nav. /election is a priority landing page (seasonal political-PR
// flagship) so it sits in the top bar between Results and Insights. Search
// is also priority — promoted from icon-only to a labeled button in the
// right cluster (see below). Press remains secondary (mobile drawer + footer).
//
// Work vs Results is a deliberate editorial split: /work is the visual
// portfolio ("are they any good?"), /case-studies is the metrics-led proof
// ("does it work?"). Both stay reachable from the primary bar.
const NAV = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/case-studies", label: "Results" },
  { href: "/election", label: "Election" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

// Bengali primary nav (native /bn twins; Work/Insights have no twin yet so
// they point at the English pages).
const NAV_BN = [
  { href: "/bn/services", label: "সেবা" },
  { href: "/work", label: "কাজ" },
  { href: "/case-studies", label: "ফলাফল" },
  { href: "/bn/election", label: "নির্বাচন" },
  { href: "/blog", label: "ইনসাইট" },
  { href: "/bn/about", label: "স্টুডিও" },
  { href: "/bn/contact", label: "যোগাযোগ" },
];

// Pages that have a native Bengali twin. Used by the EN | বাং switcher.
const BN_TWINS = ["/", "/services", "/about", "/contact", "/book", "/election"];
function twinPath(pathname: string): { bn: string; en: string } {
  const isBn = pathname === "/bn" || pathname.startsWith("/bn/");
  const en = isBn ? pathname.replace(/^\/bn/, "") || "/" : pathname;
  const hasTwin = BN_TWINS.includes(en) || en.startsWith("/services/");
  return { en, bn: hasTwin ? (en === "/" ? "/bn" : `/bn${en}`) : "/bn" };
}

// Secondary nav — only Press now; Election + Search were promoted to
// the primary bar / right cluster. Press still surfaces in the mobile
// drawer + footer for journalist discoverability.
const SECONDARY = [
  { href: "/press", label: "Press & media" },
];

export function Header() {
  const pathname = usePathname() || "/";
  const isBn = pathname === "/bn" || pathname.startsWith("/bn/");
  const twin = twinPath(pathname);
  const nav = isBn ? NAV_BN : NAV;
  const homeHref = isBn ? "/bn" : "/";
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Drawer a11y: when open, move focus to first link, trap Tab inside,
  // and ESC closes the drawer + returns focus to the hamburger.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusables = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusables[0]?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function closeDrawer() {
    setOpen(false);
    // Return focus to the hamburger so keyboard users don't lose their place.
    triggerRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="max-w-container mx-auto flex h-16 items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
        {/* ─── Logo ──────────────────────────────────────────────────── */}
        <Link
          href={homeHref as never}
          className="flex flex-shrink-0 items-center gap-2.5"
          aria-label="Public Pulse Agency home"
        >
          <span aria-hidden className="inline-block h-[3px] w-5 bg-brand-orange" />
          <span className="font-pr-serif text-[20px] font-semibold tracking-tight text-ink">
            Public&nbsp;<span className="text-brand-orange">Pulse</span>
          </span>
        </Link>

        {/* ─── Primary nav (desktop) ──────────────────────────────── */}
        <nav aria-label="Primary" className="hidden md:flex md:flex-1 md:justify-center">
          <ul className="flex items-center gap-6 text-[14px] font-medium text-ink/75 lg:gap-8">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href as never}
                  className="transition hover:text-ink focus-visible:text-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ─── Right cluster: search + CTA + hamburger ─────────────── */}
        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <div
            className="hidden items-center overflow-hidden rounded-full border border-ink/15 text-[12px] font-semibold md:inline-flex"
            role="group"
            aria-label="Language"
          >
            <Link
              href={twin.en as never}
              hrefLang="en"
              aria-current={!isBn ? "true" : undefined}
              className={`px-3 py-2 ${!isBn ? "bg-ink text-cp-gold-ink" : "text-ink/75 hover:text-ink"}`}
            >
              EN
            </Link>
            <Link
              href={twin.bn as never}
              hrefLang="bn"
              aria-current={isBn ? "true" : undefined}
              className={`px-3 py-2 ${isBn ? "bg-ink text-cp-gold-ink" : "text-ink/75 hover:text-ink"}`}
            >
              বাং
            </Link>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[13px] font-medium text-ink/75 transition hover:border-ink hover:text-ink md:inline-flex"
          >
            <Search className="h-[15px] w-[15px]" aria-hidden />
            Search
          </Link>
          <Link
            href={(isBn ? "/bn/book" : "/book") as never}
            className="btn btn-orange hidden text-[14px] sm:inline-flex"
          >
            {isBn ? "কল বুক করুন" : "Book a call"}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-card border border-ink/40 text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* ─── Mobile drawer ─────────────────────────────────────────── */}
      {open && (
        <div
          ref={drawerRef}
          id="mobile-nav-drawer"
          role="region"
          aria-label="Mobile navigation"
          className="border-t border-ink/10 bg-paper md:hidden"
        >
          <div className="px-5 py-6">
            {/* Priority block — Election + Search pinned to top with
                brand-orange accent so they're the first thing thumbed. */}
            <ul className="space-y-2">
              <li>
                <Link
                  href={(isBn ? "/bn/election" : "/election") as never}
                  onClick={closeDrawer}
                  className="flex items-center justify-between rounded-card border-2 border-brand-orange bg-brand-orange/5 px-4 py-3 text-lg font-bold text-ink"
                >
                  <span className="flex items-center gap-2">
                    {isBn ? "নির্বাচনী প্রস্তুতি" : "Election readiness"}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-brand-orange" aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  onClick={closeDrawer}
                  className="flex items-center justify-between rounded-card border border-ink/15 px-4 py-3 text-base font-semibold text-ink"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-ink/75" aria-hidden />
                    Search the site
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink/75" aria-hidden />
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-5 border-ink/10" aria-hidden />

            {/* Primary nav */}
            <ul className="space-y-1 text-lg font-bold text-ink">
              {nav.filter((n) => !n.href.endsWith("/election")).map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href as never}
                    className="flex items-center justify-between py-2.5 transition hover:text-brand-orange"
                    onClick={closeDrawer}
                  >
                    <span>{n.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-ink/75" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <hr className="my-5 border-ink/10" aria-hidden />

            {/* Secondary nav */}
            <p className="text-eyebrow uppercase tracking-wider text-ink/75">More</p>
            <ul className="mt-3 space-y-1 text-base font-medium text-ink/85">
              {SECONDARY.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="flex items-center justify-between py-2 transition hover:text-brand-orange"
                    onClick={closeDrawer}
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-ink/75" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Primary CTA + WhatsApp fallback */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={(isBn ? "/bn/book" : "/book") as never}
                onClick={closeDrawer}
                className="btn btn-orange w-full justify-center"
              >
                {isBn ? "কল বুক করুন" : "Book a call"}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={(isBn ? twin.en : twin.bn) as never}
                hrefLang={isBn ? "en" : "bn"}
                onClick={closeDrawer}
                className="btn btn-secondary w-full justify-center"
              >
                {isBn ? "Read in English" : "বাংলায় পড়ুন"}
              </Link>
              <a
                href="https://wa.me/message/TBIM4KYTCFPEI1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDrawer}
                className="btn btn-secondary w-full justify-center"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
