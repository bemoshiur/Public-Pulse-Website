import type { Client, Work } from "@/db/schema";
import { SERVICES } from "@/lib/services";
import { INDUSTRIES } from "@/lib/taxonomies/industries";
import { LOCATIONS } from "@/lib/taxonomies/locations";
import { DISCIPLINES } from "@/lib/taxonomies/disciplines";
import { RepeatableEditor } from "@/components/admin/RepeatableEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CheckboxGroup } from "./CheckboxGroup";
import { MetricsEditor } from "./MetricsEditor";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Work>;
  clients: Client[];
  submitLabel: string;
};

// Plain HTML form posting to a server action, same shape as CaseStudyForm /
// ClientForm — plus five client-island editors (CheckboxGroup ×2,
// RepeatableEditor, MetricsEditor, MediaUploader) that each serialize
// structured state into a hidden input, so nothing on this form is a raw
// JSON textarea.

export function WorkForm({ action, initial, clients, submitLabel }: Props) {
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
          <select id="locale" name="locale" defaultValue={initial?.locale ?? "en"} className="form-input">
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </Field>
        <Field label="Title" id="title" required className="md:col-span-2">
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
        <Field label="Tagline (short, shown under the title on cards)" id="tagline" className="md:col-span-2">
          <input
            id="tagline"
            name="tagline"
            type="text"
            defaultValue={initial?.tagline ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── Client & confidentiality ───────────────────────────────── */}
      <SectionHead>Client &amp; confidentiality</SectionHead>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Client" id="clientId">
          <select id="clientId" name="clientId" defaultValue={initial?.clientId ?? ""} className="form-input">
            <option value="">— no client —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Confidentiality" id="confidentiality" required>
          <select
            id="confidentiality"
            name="confidentiality"
            required
            defaultValue={initial?.confidentiality ?? "named"}
            className="form-input"
          >
            <option value="named">Named — show client name &amp; logo</option>
            <option value="anonymised">Anonymised — show label only</option>
          </select>
        </Field>
        <Field
          label="Anonymous label (required when confidentiality is Anonymised)"
          id="anonLabel"
          className="md:col-span-2"
        >
          <input
            id="anonLabel"
            name="anonLabel"
            type="text"
            placeholder={`A Cox's Bazar resort`}
            defaultValue={initial?.anonLabel ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Year" id="year">
          <input
            id="year"
            name="year"
            type="number"
            min={2000}
            max={2100}
            defaultValue={initial?.year ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Window label" id="windowLabel">
          <input
            id="windowLabel"
            name="windowLabel"
            type="text"
            placeholder="90 days"
            defaultValue={initial?.windowLabel ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── Taxonomy (catalog-backed — drives filter chips + related work) */}
      <SectionHead>Taxonomy</SectionHead>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Industry" id="industrySlug">
          <select
            id="industrySlug"
            name="industrySlug"
            defaultValue={initial?.industrySlug ?? ""}
            className="form-input"
          >
            <option value="">— none —</option>
            {INDUSTRIES.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" id="locationSlug">
          <select
            id="locationSlug"
            name="locationSlug"
            defaultValue={initial?.locationSlug ?? ""}
            className="form-input"
          >
            <option value="">— none —</option>
            {LOCATIONS.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <CheckboxGroup
          name="serviceSlugs"
          label="Services delivered"
          options={SERVICES.map((s) => ({ slug: s.slug, label: s.shortName }))}
          initial={initial?.serviceSlugs}
        />
        <CheckboxGroup
          name="disciplines"
          label="Disciplines"
          options={DISCIPLINES.map((d) => ({ slug: d.slug, label: d.name }))}
          initial={initial?.disciplines}
        />
      </div>

      {/* ── Narrative ───────────────────────────────────────────────── */}
      <SectionHead>Narrative</SectionHead>
      <Field label="Summary (card copy + AnswerBlock source, 40–60 words)" id="summary" required>
        <textarea
          id="summary"
          name="summary"
          required
          rows={3}
          minLength={20}
          maxLength={900}
          defaultValue={initial?.summary ?? ""}
          className="form-input resize-y"
        />
      </Field>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Field label="Context" id="context">
          <textarea
            id="context"
            name="context"
            rows={5}
            maxLength={3000}
            defaultValue={initial?.context ?? ""}
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
        <Field label="Outcome" id="outcome">
          <textarea
            id="outcome"
            name="outcome"
            rows={5}
            maxLength={3000}
            defaultValue={initial?.outcome ?? ""}
            className="form-input resize-y"
          />
        </Field>
      </div>

      {/* ── Deliverables + metrics ─────────────────────────────────── */}
      <SectionHead>Deliverables &amp; metrics</SectionHead>
      <RepeatableEditor
        name="deliverables"
        label="Deliverables"
        placeholder="e.g. 12 short-form video ads"
        initial={initial?.deliverables}
      />
      <div className="mt-5">
        <MetricsEditor name="metrics" initial={initial?.metrics} />
      </div>

      {/* ── Media ───────────────────────────────────────────────────── */}
      <SectionHead>Media</SectionHead>
      <MediaUploader name="media" workSlug={initial?.slug || "new-work"} initial={initial?.media} />
      {!initial?.slug && (
        <p className="mt-2 text-meta text-slate-500">
          Uploads before the slug is saved are stored under a temporary folder. Save once with a
          slug set, then re-upload if you want tidy storage paths — the images themselves work
          either way.
        </p>
      )}

      {/* ── Links ───────────────────────────────────────────────────── */}
      <SectionHead>Links</SectionHead>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Live URL" id="liveUrl">
          <input
            id="liveUrl"
            name="liveUrl"
            type="text"
            placeholder="https://example.com"
            defaultValue={initial?.liveUrl ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Meta Ad Library URL" id="adLibraryUrl">
          <input
            id="adLibraryUrl"
            name="adLibraryUrl"
            type="text"
            placeholder="https://www.facebook.com/ads/library/..."
            defaultValue={initial?.adLibraryUrl ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Matching case study slug (optional)" id="caseStudySlug">
          <input
            id="caseStudySlug"
            name="caseStudySlug"
            type="text"
            placeholder="coxs-bazar-resort-bookings"
            defaultValue={initial?.caseStudySlug ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── Testimonial (only when real) ───────────────────────────── */}
      <SectionHead>Testimonial (only when real)</SectionHead>
      <Field label="Quote" id="testimonialQuote">
        <textarea
          id="testimonialQuote"
          name="testimonialQuote"
          rows={3}
          maxLength={1500}
          defaultValue={initial?.testimonialQuote ?? ""}
          className="form-input resize-y"
        />
      </Field>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Attribution (name)" id="testimonialAttribution">
          <input
            id="testimonialAttribution"
            name="testimonialAttribution"
            type="text"
            maxLength={200}
            defaultValue={initial?.testimonialAttribution ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Role / company" id="testimonialRole">
          <input
            id="testimonialRole"
            name="testimonialRole"
            type="text"
            maxLength={200}
            defaultValue={initial?.testimonialRole ?? ""}
            className="form-input"
          />
        </Field>
      </div>

      {/* ── Publish controls ───────────────────────────────────────── */}
      <SectionHead>Publish</SectionHead>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-navy">
          <input type="checkbox" name="featured" value="true" defaultChecked={initial?.featured ?? false} />
          Featured on /work + homepage rail
        </label>
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
        <Field label="Status" id="status">
          <select id="status" name="status" defaultValue={initial?.status ?? "draft"} className="form-input">
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>

      {/* ── SEO ─────────────────────────────────────────────────────── */}
      <SectionHead>SEO</SectionHead>
      <div className="grid gap-5 md:grid-cols-2">
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

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-8 mb-5 border-t border-slate-200 pt-6 font-serif text-lg font-medium text-brand-navy first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </h2>
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
