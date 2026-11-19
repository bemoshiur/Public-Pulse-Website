import fs from "node:fs";
import path from "node:path";
import "@/pp/pp.css";
import { DcBoot } from "./DcBoot";
import { PP_ANSWERS, answerMarkup } from "@/pp/answers";

type Prerendered = { name: string; html: string; templates: string; style: string };

const cache = new Map<string, Prerendered>();

/**
 * The design snapshots ship without an AnswerBlock. Insert the page's 40–60
 * word answer right after the hero section, in BOTH the SSR html and the
 * runtime templates (the Preact runtime re-renders from the templates on
 * mount, so markup that exists only in the html would vanish after load).
 * Fails the build if the anchor is missing, so a regenerated design can never
 * silently drop the AnswerBlock again.
 */
function insertAfterHero(src: string, markup: string, label: string, name: string): string {
  const h1 = src.search(/<h?h1[\s>]/);
  if (h1 < 0) throw new Error(`pp/${name}: no <h1> found in ${label}; cannot place the AnswerBlock.`);
  const end = src.indexOf("</section>", h1);
  if (end < 0) throw new Error(`pp/${name}: hero </section> not found in ${label}; cannot place the AnswerBlock.`);
  const at = end + "</section>".length;
  return src.slice(0, at) + markup + src.slice(at);
}

function withAnswer(p: Prerendered, name: string): Prerendered {
  const answer = PP_ANSWERS[name];
  if (!answer) throw new Error(`pp/${name}: no entry in src/pp/answers.ts (AnswerBlock is required).`);
  const markup = answerMarkup(answer);
  return {
    ...p,
    html: insertAfterHero(p.html, markup, "html", name),
    templates: insertAfterHero(p.templates, markup, "templates", name),
  };
}

function load(name: string): Prerendered {
  let p = cache.get(name);
  if (!p) {
    p = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/pp/pages", `${name}.json`), "utf8"),
    ) as Prerendered;
    p = withAnswer(p, name);
    cache.set(name, p);
  }
  return p;
}

/**
 * Renders a page from Mahir's design: the server-rendered HTML (so the H1,
 * copy and links are in the SSR output for crawlers) plus the tiny Preact
 * runtime that takes over for animation and interaction.
 */
export function DcPage({ name }: { name: string }) {
  const p = load(name);
  return (
    <>
      {/* The design ships its own nav, footer and cursor, so the shared chrome is hidden here. */}
      <style>{"body>header,body>footer,body>aside,.cursor-glow,.scroll-progress{display:none!important}"}</style>
      {p.style ? <style dangerouslySetInnerHTML={{ __html: p.style }} /> : null}
      <div id="app" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: p.html }} />
      <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: p.templates
            .replace(/<(\/?)h1/g, "<$1hh1")
            .replace(/answer-block/g, "answer-blk")
            .replace(/data-speakable/g, "data-spk") }} />
      <DcBoot name={name} />
    </>
  );
}
