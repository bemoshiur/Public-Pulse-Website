import fs from "node:fs";
import path from "node:path";
import "@/pp/pp.css";
import { DcBoot } from "./DcBoot";

type Prerendered = { name: string; html: string; templates: string; style: string };

const cache = new Map<string, Prerendered>();
function load(name: string): Prerendered {
  let p = cache.get(name);
  if (!p) {
    p = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/pp/pages", `${name}.json`), "utf8"),
    ) as Prerendered;
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
      <div hidden suppressHydrationWarning dangerouslySetInnerHTML={{ __html: p.templates.replace(/<(\/?)h1/g, "<$1hh1") }} />
      <DcBoot name={name} />
    </>
  );
}
