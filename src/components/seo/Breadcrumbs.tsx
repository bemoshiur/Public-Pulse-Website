import Link from "next/link";
import type { Crumb } from "@/lib/schema";

type BreadcrumbsProps = { crumbs: Crumb[]; /** "dark" for use on dark / crimson heroes. */ tone?: "light" | "dark" };

export function Breadcrumbs({ crumbs, tone = "light" }: BreadcrumbsProps) {
  const dark = tone === "dark";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${dark ? "text-white/70" : "text-ink/75"}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? "text-white" : "text-ink/80"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={dark ? "hover:text-cp-gold" : "hover:text-brand-orange"}>
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden="true" className={dark ? "text-white/65" : "text-ink/75"}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
