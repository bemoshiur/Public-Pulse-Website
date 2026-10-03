import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";

// The Canva "Public Pulse Profile | Political PR" brochure, shown on the
// political-PR surfaces. The source is image-only, so the "what's inside" list
// below is the indexable text equivalent (taken from the brochure's own page
// headings). Gallery images are 900x1273 WebP (A4), the download is a 1.8 MB
// web-weight copy of the 46 MB original.

export const PROFILE_PDF = "/downloads/public-pulse-political-pr-profile.pdf";
export const PROFILE_PDF_BYTES = 1_901_497; // keep in sync with the file on disk
export const PROFILE_PAGES = 10;
const W = 900;
const H = 1273;

const PAGE_ALTS = [
  "Cover: political PR, image building and election campaign solution, marked confidential.",
  "Page 2: the agency's profile with candidate profile cards.",
  "Page 3: the service ecosystem, including political content.",
  "Page 4: how an election campaign looks: social media management, a candidate website and its key features.",
  "Page 5: the Game Changer, a QR-based campaign access system and candidate photo frames.",
  "Page 6: a WhatsApp community system and a video solution from pre-production to distribution.",
  "Page 7: the campaign journey, step 01, with portfolio and live examples.",
  "Page 8: campaign journey steps 02 and 03, and the content formats.",
  "Page 9: campaign journey steps 04 onward, the outcome, and real-time consultancy.",
  "Page 10: why the agency is different, live client profiles and contact details.",
];

const INSIDE = [
  "Service ecosystem and political content",
  "How an election campaign looks, end to end",
  "QR-based campaign access system",
  "WhatsApp community and video solutions",
  "The campaign journey, step by step",
  "Content formats and real-time consultancy",
  "Live client profiles",
];

const mb = (PROFILE_PDF_BYTES / 1_048_576).toFixed(1);

export function CampaignProfile({ variant = "full" }: { variant?: "full" | "band" }) {
  const download = (
    <a
      href={PROFILE_PDF}
      download
      className="btn btn-gold"
      data-track="campaign-profile-download"
    >
      <Download className="h-4 w-4" aria-hidden />
      Download the profile (PDF, {mb} MB)
    </a>
  );

  if (variant === "band") {
    return (
      <div className="theme-campaign cp-surface rounded-panel-lg px-6 py-10 md:px-12 md:py-12">
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Image
              src="/campaign-profile/page-01.webp"
              alt={PAGE_ALTS[0]}
              width={W}
              height={H}
              sizes="(min-width: 768px) 220px, 60vw"
              unoptimized
              className="mx-auto w-48 rounded-card border border-white/20 shadow-card md:w-full"
            />
          </div>
          <div className="md:col-span-9">
            <span className="cp-tab">Campaign profile</span>
            <h2 className="mt-4 text-h2 tracking-tight text-white">
              The political PR profile, <span className="cp-gold">in {PROFILE_PAGES} pages.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-lead text-white/80">
              Services, the QR-based campaign access system, the campaign journey and live
              client profiles, in one document you can forward to your team.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {download}
              <Link href="/election" className="btn btn-gold-ghost">
                See the election playbook
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="cp-tab">Campaign profile · PDF</span>
          <h2 className="mt-4 text-h1 tracking-tight text-white">
            The campaign profile, <span className="cp-gold">before the call.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lead text-white/80">
            Ten pages on how we run a constituency campaign: the services, the
            QR-based campaign access system, the journey from foundation to
            outcome, and live client profiles. Read it, forward it, bring questions.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {download}
            <span className="inline-flex items-center gap-2 text-sm text-white/70">
              <FileText className="h-4 w-4" aria-hidden />
              {PROFILE_PAGES} pages · A4 · PDF · {mb} MB
            </span>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="cp-panel p-5">
            <p className="text-eyebrow uppercase cp-gold">What&rsquo;s inside</p>
            <ul className="mt-3 space-y-2 text-white/90">
              {INSIDE.map((t) => (
                <li key={t} className="flex items-start gap-3 text-body">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-cp-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ul
        className="cp-strip mt-10"
        role="list"
        tabIndex={0}
        aria-label={`Campaign profile, ${PROFILE_PAGES} pages. Scroll sideways to browse.`}
      >
        {PAGE_ALTS.map((alt, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <li key={n}>
              <a
                href={`/campaign-profile/page-${n}.webp`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open page ${i + 1} of ${PROFILE_PAGES} full size`}
                className="block overflow-hidden rounded-card border border-cp-line/80 bg-black/30 shadow-card transition hover:border-cp-gold"
              >
                <Image
                  src={`/campaign-profile/page-${n}.webp`}
                  alt={alt}
                  width={W}
                  height={H}
                  sizes="(min-width: 768px) 330px, 72vw"
                  loading="lazy"
                  unoptimized
                  className="h-auto w-full"
                />
              </a>
              <p className="mt-2 text-meta text-white/60">
                {i + 1} / {PROFILE_PAGES}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
