import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AnswerBlock } from "@/components/seo/AnswerBlock";
import type { Crumb } from "@/lib/schema";
import { SITE } from "@/lib/site";

export function BnHero({
  crumbs,
  chip,
  title,
  lead,
  answer,
  ctaLabel = "ফ্রি পরামর্শ নিন",
  ctaHref = "/bn/book",
}: {
  crumbs: Crumb[];
  chip: string;
  title: ReactNode;
  lead: string;
  answer?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-paper">
      <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mt-8 max-w-4xl">
          <span className="chip chip-orange">{chip}</span>
          <h1 className="mt-6 text-display leading-[1.1] tracking-tight text-ink">{title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-ink/70">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaHref} className="btn btn-orange">
              {ctaLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={SITE.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              হোয়াটসঅ্যাপ
            </a>
          </div>
        </div>
        {answer ? (
          <div className="mt-10 max-w-3xl">
            <AnswerBlock>{answer}</AnswerBlock>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
