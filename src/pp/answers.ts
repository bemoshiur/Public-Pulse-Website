// AnswerBlock copy for the 16 pages that ship as prerendered design snapshots
// (src/pp/pages/*.json). Those snapshots contain no AnswerBlock, and CLAUDE.md
// + docs/SEO-AEO-GEO.md require a 40–60 word quotable answer (class
// `.answer-block`, `data-speakable`) on every content page. DcPage injects
// these at load time, so they survive any regeneration of the design JSON.
//
// Rules (docs/SEO-AEO-GEO.md): lead with the direct answer; subject + verb +
// object in the first sentence; no marketing fluff or superlatives; brand name
// exactly once; ONLY facts that already appear on the site (no invented
// statistics). Numbers that exist in a catalog are derived from it so they
// cannot drift. The module validates every answer at import, so a bad edit
// fails the build instead of shipping.

import { SERVICES } from "@/lib/services";
import { LOCATIONS } from "@/lib/taxonomies/locations";
import { INDUSTRIES } from "@/lib/taxonomies/industries";

export type PpAnswer = { q: string; a: string };

const services = SERVICES.filter((s) => s.ready);
const cities = LOCATIONS.map((l) => l.name);
const industries = INDUSTRIES.map((i) => i.name);

const list = (xs: string[]) =>
  xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

export const PP_ANSWERS: Record<string, PpAnswer> = {
  Main: {
    q: "What is Public Pulse?",
    a: `Public Pulse is a Dhaka-based digital marketing and political PR agency serving Bangladeshi brands, candidates and parties. One team delivers strategy, creative, paid media, PR and analytics across ${services.length} integrated services, billed in BDT by a registered Bangladeshi entity, in English and Bangla.`,
  },
  Services: {
    q: "What services does the agency offer?",
    a: `Public Pulse offers ${services.length} integrated services from Dhaka: ${list(services.map((s) => s.shortName))}. One accountable team plans and delivers them together, so strategy, creative, paid media and analytics are reported weekly in a single report rather than handed between agencies.`,
  },
  Work: {
    q: "What client work does the agency show?",
    a: "Public Pulse's client work spans political campaigns, hospitality, e-commerce and brand building across Bangladesh. Each project lists the client, or an anonymised sector label where an NDA applies, with the services delivered and the outcome. Only real, documented projects appear on this page, and nothing is invented.",
  },
  Results: {
    q: "What results has the agency delivered?",
    a: "Public Pulse case studies show real client outcomes across Bangladesh in paid media, social media, PR, SEO and political PR. Each lists documented metrics, the time window and the services delivered. Where an NDA applies, the client is anonymised by sector, and no figure is invented or estimated.",
  },
  Election: {
    q: "How does the agency run election campaigns?",
    a: "Public Pulse runs a 90-day election playbook for Bangladeshi candidates and parties, covering constituency research, narrative design, coordinated ground and digital campaigning, and a 24-hour crisis response. Work is protected by an NDA and billed in BDT, and political ads follow Meta's authorisation and disclosure rules.",
  },
  Insights: {
    q: "What does the agency publish?",
    a: "The Public Pulse blog publishes practitioner guides on digital marketing and political PR in Bangladesh, covering paid media, SEO, hospitality marketing and brand building. Articles use real local context such as BDT budgets, Bangladeshi platforms and city markets, and each one opens with a short direct answer.",
  },
  Studio: {
    q: "Who is Public Pulse?",
    a: `Public Pulse is a Bangladesh digital marketing and political PR studio founded in Dhaka in 2024 to combine work that clients usually split across several vendors. It offers ${services.length} integrated services in English and Bangla, bills every client in BDT, and operates as a registered Bangladeshi entity.`,
  },
  Contact: {
    q: "How can I contact the agency?",
    a: "You can reach Public Pulse in Dhaka on WhatsApp at +880 1717-714676, which replies within 2 hours, by email at info@publicpulse.com.bd, which replies within 24 hours, or through the contact form. The team works Saturday to Thursday, and the first consultation is free.",
  },
  Book: {
    q: "How do I book a call?",
    a: "You can book a free strategy call with Public Pulse by choosing a time in the calendar on this page, or by messaging on WhatsApp instead. The call reviews your channels, goals and fit, with no pitch deck. A written proposal follows within 24 hours of the discovery call.",
  },
  Pricing: {
    q: "How much does the agency charge?",
    a: "Public Pulse prices services in BDT, starting at ৳45,000 per month for a single-platform retainer, ৳1,20,000 or more per month for a typical multi-channel engagement, and ৳1,50,000 or more for one-time project work. Every quote follows a free discovery call and a written proposal within 24 hours.",
  },
  Press: {
    q: "What does the press desk provide?",
    a: "Public Pulse gives journalists a copy-ready boilerplate in 50-word and 120-word versions, brand assets and a direct press desk. The boilerplate covers the agency's entity, services, sister concerns and contact details. The press desk replies within one working day, and the same day for live deadlines.",
  },
  Guides: {
    q: "What playbooks does the agency publish?",
    a: "Public Pulse publishes step-by-step playbooks for Bangladesh digital marketing and political PR, each grounded in local context. Topics include running a constituency-targeted Facebook ad campaign for an election, setting up Meta Conversions API tracking and publishing with IndexNow, each broken into numbered steps with a total time estimate.",
  },
  Glossary: {
    q: "What does the glossary cover?",
    a: "The Public Pulse glossary defines digital marketing, political PR, paid media, SEO and analytics terms in plain English with Bangla translations. Each entry gives a short definition, a longer Bangladesh-specific explanation and links to related terms, so marketers, candidates and journalists can check what a term means in practice.",
  },
  Compare: {
    q: "What decisions does the agency compare?",
    a: "Public Pulse publishes side-by-side comparisons for common Bangladesh marketing decisions, such as an integrated agency versus an in-house team, and Facebook versus Google advertising. Each compares cost, speed, skills, accountability and brand control, and ends with a clear recommendation rather than a sales pitch.",
  },
  Locations: {
    q: "Where does the agency work?",
    a: `Public Pulse is headquartered in Dhaka and runs active engagements in ${cities.length} Bangladeshi cities: ${list(cities)}. Each city page describes the local market, its leading industries and the relevant services, rather than repeating a copy-pasted template.`,
  },
  Industries: {
    q: "Which industries does the agency serve?",
    a: `Public Pulse has worked across ${industries.length} Bangladeshi industries: ${list(industries)}. Each vertical page lists its dominant channels, its priorities and the service playbooks that suit it best, so a brief can start from what already works locally.`,
  },
};

// ─── Build-time validation ─────────────────────────────────────────────
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
for (const [page, { q, a }] of Object.entries(PP_ANSWERS)) {
  const n = words(a);
  if (n < 40 || n > 60) {
    throw new Error(`pp/answers: "${page}" answer is ${n} words; the contract is 40-60 (docs/SEO-AEO-GEO.md).`);
  }
  const brand = (a.match(/Public Pulse/g) ?? []).length;
  if (brand !== 1) {
    throw new Error(`pp/answers: "${page}" names the brand ${brand} times; the contract is exactly once.`);
  }
  if (!q.trim()) throw new Error(`pp/answers: "${page}" has no question heading.`);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Static markup (no Preact bindings) so it is identical in the SSR snapshot and the runtime templates. */
export function answerMarkup({ q, a }: PpAnswer): string {
  return (
    `<section class="pp-answer" aria-labelledby="pp-answer-q"><div class="wrap">` +
    `<h2 id="pp-answer-q" class="eyebrow pp-answer-q">${esc(q)}</h2>` +
    `<div class="answer-block" data-speakable>${esc(a)}</div>` +
    `</div></section>`
  );
}
