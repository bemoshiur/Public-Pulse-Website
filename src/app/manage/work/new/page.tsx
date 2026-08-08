import { listAllClients } from "@/lib/data/clients";
import { WorkForm } from "../WorkForm";
import { createWork } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function NewWorkPage() {
  const clients = await listAllClients();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-medium text-brand-navy">New work</h1>
      <p className="mt-3 text-sm text-slate-600">
        Saving as draft does not affect /work. Set status to Published to make it live — the public
        portfolio refreshes automatically.
      </p>
      <div className="mt-8">
        <WorkForm action={createWork} clients={clients} submitLabel="Create" />
      </div>
    </div>
  );
}
