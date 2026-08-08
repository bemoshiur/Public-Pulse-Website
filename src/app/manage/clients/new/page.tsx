import { ClientForm } from "../ClientForm";
import { createClient } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-medium text-brand-navy">New client</h1>
      <p className="mt-3 text-sm text-slate-600">
        Creates the shared client identity used by /work and case studies.
      </p>
      <div className="mt-8">
        <ClientForm action={createClient} submitLabel="Create" />
      </div>
    </div>
  );
}
