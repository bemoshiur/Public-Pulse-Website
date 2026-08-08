import { notFound } from "next/navigation";
import { getClientById } from "@/lib/data/clients";
import { ClientForm } from "../ClientForm";
import { updateClient } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getClientById(id);
  if (!row) notFound();

  const action = updateClient.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-medium text-brand-navy">Edit client</h1>
      <p className="mt-3 text-sm text-slate-600">
        Changes refresh /work via <code>updateTag(&apos;clients&apos;)</code>.
      </p>
      <div className="mt-8">
        <ClientForm action={action} initial={row} submitLabel="Save changes" />
      </div>
    </div>
  );
}
