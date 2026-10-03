import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

// Reusable "Frequently asked" block for index/hub pages. Semantic
// <dl><div><dt/><dd/></div></dl> nesting so FAQ extractors count each pair.
// Pair it with `faqPageSchema(faqs)` (dl markup) from src/lib/schema.ts in the
// page's JsonLd array so the visible text and the structured data stay identical.

export type FaqItem = { q: string; a: string };

type FaqSectionProps = {
  faqs: FaqItem[];
  eyebrow?: string;
  heading?: string;
};

export function FaqSection({
  faqs,
  eyebrow = "FAQ",
  heading = "Frequently asked.",
}: FaqSectionProps) {
  return (
    <Section size="lg" className="bg-paper">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-eyebrow uppercase text-brand-orange">{eyebrow}</p>
          <h2 className="mt-4 text-h2 tracking-tight text-ink">{heading}</h2>
          <dl className="mt-10 space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-panel bg-paper-alt p-6 md:p-7">
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
