import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";

import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  localBusinessSchema,
  organizationSchema,
  professionalServiceSchema,
  siteNavigationSchema,
  websiteSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterBn } from "@/components/layout/FooterBn";
import { FooterSwitch } from "@/components/layout/FooterSwitch";
import { SocialSidebar } from "@/components/layout/SocialSidebar";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { AiReferralTracker } from "@/components/analytics/AiReferralTracker";
import { CommandPalette } from "@/components/search/CommandPalette";
import { ScrollProgress } from "@/components/motion";
import { StickyBar, ExitIntent } from "@/components/lead-capture";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bn",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    // 58 chars — under Google's 60-char (~600 px) title cutoff so the full
    // brand name stays visible in SERP. Was 65 chars and getting truncated.
    title: "Public Pulse — Bangladesh Digital Marketing & PR Agency",
    description:
      "Bangladesh's 360° digital marketing & political PR agency. Political PR, social media, content, paid ads, hospitality, branding, SEO. Call +880 1717-714676.",
    path: "/",
  }),
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-BD" className={`${archivo.variable} ${jetbrains.variable} ${bengali.variable} reveal-ready`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-paper text-ink">
        {/* Safety kill-switch: 2.5s after load, drop reveal-ready so no element
            can stay invisible if IntersectionObserver fails to fire. */}
        <Script id="reveal-killswitch" strategy="afterInteractive">
          {`setTimeout(function(){document.documentElement.classList.remove('reveal-ready')},2500);`}
        </Script>
        {/* Cookie banner + consent-gated GTM/GA4/Pixel.
            Renders nothing on SSR; hydrates client-side and either:
              - injects the 3 tracking scripts (if consent='granted')
              - shows the banner (if no prior decision)
              - stays silent (if consent='denied')
            See src/components/analytics/CookieConsent.tsx for the policy. */}
        <CookieConsent />
        {/* Fires an ai_referral event when a visit comes from an AI answer
            engine (ChatGPT/Perplexity/Gemini/…) — on-site AEO proof. */}
        <AiReferralTracker />
        <JsonLd
          data={[
            organizationSchema(),
            websiteSchema(),
            localBusinessSchema(),
            professionalServiceSchema(),
            // Main nav as structured data — sitelinks signal for Google/Bing.
            // Sitelinks themselves are auto-generated; this just gives the
            // engines a confident map of the top-level URLs.
            siteNavigationSchema([
              { name: "Services", url: "/services" },
              { name: "Pricing", url: "/pricing" },
              { name: "Work", url: "/case-studies" },
              { name: "Election readiness", url: "/election" },
              { name: "Insights", url: "/blog" },
              { name: "Studio", url: "/about" },
              { name: "Contact", url: "/contact" },
              { name: "Press & media", url: "/press" },
              { name: "Search", url: "/search" },
              { name: "Book a call", url: "/book" },
            ]),
          ]}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-brand-orange focus:px-3 focus:py-2 focus:text-cp-gold-ink focus:shadow-lg"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">{children}</main>
        <SocialSidebar />
        <FooterSwitch en={<Footer />} bn={<FooterBn />} />
        <WhatsAppFab />
        <StickyBar />
        <ExitIntent />
        {/* ⌘K / Ctrl+K opens the site-wide search palette. */}
        <CommandPalette />
      </body>
    </html>
  );
}
