import type { Client } from "@/db/schema";

type Props = {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Client>;
  submitLabel: string;
};

// Plain HTML form posting to a server action — no client JS needed.
// Mirrors src/app/manage/case-studies/CaseStudyForm.tsx: same Field
// helper, same .form-input class, same shape (action + initial + submitLabel).

export function ClientForm({ action, initial, submitLabel }: Props) {
  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-8">
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
        <Field label="Name" id="name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initial?.name ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Logo URL (light surfaces)" id="logoUrl">
          <input
            id="logoUrl"
            name="logoUrl"
            type="text"
            placeholder="/logos/client.svg"
            defaultValue={initial?.logoUrl ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Logo URL — dark surfaces (optional)" id="logoDarkUrl">
          <input
            id="logoDarkUrl"
            name="logoDarkUrl"
            type="text"
            placeholder="/logos/client-dark.svg"
            defaultValue={initial?.logoDarkUrl ?? ""}
            className="form-input"
          />
        </Field>
        <Field label="Website" id="website" className="md:col-span-2">
          <input
            id="website"
            name="website"
            type="text"
            placeholder="https://example.com"
            defaultValue={initial?.website ?? ""}
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
