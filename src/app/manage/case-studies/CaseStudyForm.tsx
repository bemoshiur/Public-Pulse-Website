import { SERVICES } from "@/lib/services";
import { INDUSTRIES } from "@/lib/taxonomies/industries";
import { LOCATIONS } from "@/lib/taxonomies/locations";
import type { CaseStudy, Client } from "@/db/schema";
import { CheckboxGroup } from "@/components/admin/CheckboxGroup";
import { MetricsEditor } from "@/components/admin/MetricsEditor";
import { FaqEditor } from "./FaqEditor";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<CaseStudy>;
  clients: Client[];
  submitLabel: string;
};

// Plain HTML form posting to a server action — no client JS needed for the
// form itself. Required fields are minimal so the entry path stays
// low-friction. The long-form narrative + structured metrics + FAQ are
// optional but unlock the full case-study detail experience when filled.
//
// industry / location / servicesJson are catalog-backed (INDUSTRIES /
// LOCATIONS / SERVICES) — free text here is exactly what silently created
// duplicate filter facets and broke getRelatedCaseStudies's exact-match
// industry lookup (Task 13). metricsJson / faqJson are structured editors
// (MetricsEditor / FaqEditor) instead of raw-JSON textareas — a missing
// comma used to throw an unstyled server exception and lose the form.

export function CaseStudyForm({ action, initial, clients, submitLabel }: Props) {
  // ── Legacy free-text taxonomy: make it VISIBLE, never silently dropped ──
  // These columns predate the catalog-backed controls, so an old row can
  // hold a value that matches no LOCATIONS/SERVICES slug. With a plain
  // catalog-only <select>, such a row renders as "— none —" and the very
  // next save nulls the value without the admin ever seeing it. Same for an
  // unmatched service slug in the checkbox group. Instead, surface the
  // orphan as an explicitly-flagged option that is selected by default, so
  // the admin decides deliberately whether to keep or re-map it.
  // Server-side validation is unchanged: actions.ts still drops anything
  // that isn't a real catalog slug, so keeping the legacy value selected
  // and saving clears it — but now that's a visible, deliberate choice.
  const legacyLocation =
    initial?.location && !LOCATIONS.some((l) => l.slug === initial.location)
      ? initial.location
      : null;
  const legacyServices = (initial?.services ?? []).filter(
    (s) => !SERVICES.some((svc) => svc.slug === s)
  );
  const serviceOptions = [
    ...SERVICES.map((s) => ({ slug: s.slug, label: s.shortName })),
    ...legacyServices.map((s) => ({ slug: s, label: `⚠ legacy value: ${s}` })),
  ];

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-8">
      {/* ── Identity ────────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Slug (URL-safe)" id="slug" required>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            pattern="[a-z0-9\-]+"
            defaultValue={initial?.slug ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Locale" id="locale">
          <select
            id="locale"
            name="locale"
            defaultValue={initial?.locale ?? "en"}
            className="form-input"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </Field>
        <Field label="Title (long form)" id="title" required className="md:col-span-2">
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="How a Cox's Bazar resort grew direct bookings 47% in 90 days"
            defaultValue={initial?.title ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Client name (or sector label)" id="clientName">
          <input
            id="clientName"
            name="clientName"
            type="text"
            placeholder="A Cox's Bazar resort"
            defaultValue={initial?.clientName ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Client (logo displays if clientName is the real name)" id="clientId">
          <select
            id="clientId"
            name="clientId"
            defaultValue={initial?.clientId ?? ""}
            className="form-input"
          >
            <option value="">— no client —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">
            The logo on the case study detail page appears only when Client Name (above) is set to this
            client&rsquo;s real name. If Client Name is anonymised (e.g., a sector label), the logo stays
            hidden to respect confidentiality.
          </p>
        </Field>
        <Field label="Industry" id="industry" required>
          <select
            id="industry"
            name="industry"
            required
            defaultValue={initial?.industry ?? ""}
            className="form-input"
          >
            <option value="" disabled>
              — select an industry —
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" id="location">
          <select
            id="location"
            name="location"
            defaultValue={initial?.location ?? ""}
            className="form-input"
          >
            <option value="">— none —</option>
            {LOCATIONS.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
            {legacyLocation && (
              <option value={legacyLocation}>⚠ legacy value: {legacyLocation}</option>
            )}
          </select>
          {legacyLocation && (
            <p className="mt-1.5 text-xs text-brand-red">
              This row holds “{legacyLocation}”, which isn&rsquo;t in the location catalog. Pick a
              real location — saving while the legacy value is selected clears it.
            </p>
          )}
        </Field>
      </div>

      {/* ── Headline metric ─────────────────────────────────────────── */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Field label="Headline metric" id="metric" required>
          <input
            id="metric"
            name="metric"
            type="text"
            required
            placeholder="+47% direct bookings"
            defaultValue={initial?.metric ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Window label" id="windowLabel" required>
          <input
            id="windowLabel"
            name="windowLabel"
            type="text"
            required
            placeholder="90 days"
            defaultValue={initial?.windowLabel ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Primary service" id="serviceSlug">
          <select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue={initial?.serviceSlug ?? ""}
            className="form-input"
          >
            <option value="">— none —</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-5">
        <CheckboxGroup
          name="servicesJson"
          label="Services delivered"
          options={serviceOptions}
          initial={initial?.services}
        />
        {legacyServices.length > 0 && (
          <p className="mt-1.5 text-xs text-brand-red">
            {legacyServices.length === 1 ? "One service" : `${legacyServices.length} services`} on
            this row {legacyServices.length === 1 ? "isn't" : "aren't"} in the services catalog
            (shown above as “legacy value”). Re-map to a real service — saving drops unmatched
            values.
          </p>
        )}
      </div>

      <Field label="Summary (1–2 sentences shown on cards)" id="summary" required className="mt-5">
        <textarea
          id="summary"
          name="summary"
          required
          rows={3}
          minLength={20}
          maxLength={800}
          defaultValue={initial?.summary ?? ""}
          className="form-input resize-y"
        />
      </Field>

      {/* ── Answer-first outcome statement (AEO/GEO) ─────────────────── */}
      <Field label="Outcome statement (40–60 words, AEO/GEO answer-first)" id="outcomeStatement" className="mt-5">
        <textarea
          id="outcomeStatement"
          name="outcomeStatement"
          rows={3}
          maxLength={900}
          defaultValue={initial?.outcomeStatement ?? ""}
          className="form-input resize-y"
          placeholder="Public Pulse Agency delivered ..."
        />
      </Field>

      {/* ── Long-form narrative ─────────────────────────────────────── */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Field label="Challenge" id="challenge">
          <textarea
            id="challenge"
            name="challenge"
            rows={5}
            maxLength={3000}
            defaultValue={initial?.challenge ?? ""}
            className="form-input resize-y"
          />
        </Field>
        <Field label="Approach" id="approach">
          <textarea
            id="approach"
            name="approach"
            rows={5}
            maxLength={3000}
            defaultValue={initial?.approach ?? ""}
            className="form-input resize-y"
          />
        </Field>
        <Field label="Result" id="result">
          <textarea
            id="result"
            name="result"
            rows={5}
            maxLength={3000}
            defaultValue={initial?.result ?? ""}
            className="form-input resize-y"
          />
        </Field>
      </div>

      {/* ── Metrics callout band ────────────────────────────────────── */}
      <div className="mt-5">
        <MetricsEditor
          name="metricsJson"
          heading="Metrics callout band (shown on the case study detail page)"
          initial={initial?.metrics}
        />
      </div>

      {/* ── Optional testimonial (drives Review schema) ─────────────── */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Testimonial quote (only when real)" id="testimonialQuote">
          <textarea
            id="testimonialQuote"
            name="testimonialQuote"
            rows={3}
            maxLength={1500}
            defaultValue={initial?.testimonialQuote ?? ""}
            className="form-input resize-y"
          />
        </Field>
        <Field label="Attribution (name + role + company)" id="testimonialAttribution">
          <input
            id="testimonialAttribution"
            name="testimonialAttribution"
            type="text"
            maxLength={200}
            defaultValue={initial?.testimonialAttribution ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <div className="mt-5">
        <FaqEditor name="faqJson" initial={initial?.faqJson} />
      </div>

      {/* ── Imagery + SEO ───────────────────────────────────────────── */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Hero image URL (1200×630)" id="heroImageUrl">
          <input
            id="heroImageUrl"
            name="heroImageUrl"
            type="text"
            maxLength={500}
            defaultValue={initial?.heroImageUrl ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Display order (lower = first)" id="displayOrder">
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min={0}
            max={1000}
            defaultValue={initial?.displayOrder ?? 0}
            className="form-input"
          />
        </Field>
        <Field label="SEO title (≤60 chars)" id="seoTitle">
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            maxLength={80}
            defaultValue={initial?.seoTitle ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="SEO description (140–160 chars)" id="seoDescription">
          <input
            id="seoDescription"
            name="seoDescription"
            type="text"
            maxLength={200}
            defaultValue={initial?.seoDescription ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── Publish controls ────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-navy">
          <input type="checkbox" name="featured" value="true" defaultChecked={initial?.featured ?? false} />
          Featured on homepage Selected results
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-navy">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={initial?.published ?? false}
          />
          Publish (visible on /case-studies)
        </label>
        <Field label="Status" id="status">
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "draft"}
            className="form-input"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="submit"
          className="cta-primary inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-brand-navy">
        {label}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
