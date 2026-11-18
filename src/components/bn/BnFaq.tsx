import { Container } from "@/components/ui/Container";

export function BnFaq({ title = "প্রায়ই জিজ্ঞাসিত প্রশ্ন", faqs }: { title?: string; faqs: { q: string; a: string }[] }) {
  return (
    <section className="bg-paper-alt py-16 md:py-24">
      <Container>
        <h2 className="text-display tracking-tight text-ink">{title}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-card border border-ink/15 bg-paper p-6">
              <h3 className="text-lg font-bold text-ink">{f.q}</h3>
              <p className="mt-2 text-ink/75">{f.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
