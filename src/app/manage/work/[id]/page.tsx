import { notFound } from "next/navigation";
import { getWorkById } from "@/lib/data/works";
import { listAllClients } from "@/lib/data/clients";
import { WorkForm } from "../WorkForm";
import { updateWork } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row, clients] = await Promise.all([getWorkById(id), listAllClients()]);
  if (!row) notFound();

  const action = updateWork.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-medium text-brand-navy">Edit work</h1>
      <p className="mt-3 text-sm text-slate-600">
        Saving with status set to Published refreshes /work via{" "}
        <code>updateTag(&apos;works&apos;)</code>.
      </p>
      <div className="mt-8">
        <WorkForm action={action} initial={row} clients={clients} submitLabel="Save changes" />
      </div>
    </div>
  );
}
