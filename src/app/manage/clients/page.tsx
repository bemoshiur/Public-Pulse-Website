import Link from "next/link";
import { listAllClients } from "@/lib/data/clients";
import { deleteClient } from "./actions";
import { ConfirmButton } from "../_components/ConfirmButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ClientsPage() {
  const rows = await listAllClients();

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-medium text-brand-navy">Clients</h1>
        <Link
          href="/manage/clients/new"
          className="cta-primary inline-flex items-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white"
        >
          + New client
        </Link>
      </header>

      <p className="mt-3 text-sm text-slate-600">
        Shared identity for /work and case studies. Mutations call{" "}
        <code>updateTag(&apos;clients&apos;)</code> so the /work logo wall refreshes without redeploy.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No clients yet. Add one before attaching it to a work item.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((c) => (
            <li key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {c.logoUrl ? (
                    // Admin-only thumbnail — not public content imagery.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.logoUrl}
                      alt=""
                      className="h-10 w-10 flex-shrink-0 rounded object-contain"
                    />
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-100" aria-hidden />
                  )}
                  <div>
                    <h2 className="font-serif text-xl font-medium text-brand-navy">{c.name}</h2>
                    <p className="mt-1 text-meta uppercase text-slate-500">
                      {c.slug}
                      {c.website ? ` · ${c.website}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/manage/clients/${c.id}`}
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                  <ConfirmButton
                    action={async () => {
                      "use server";
                      await deleteClient(c.id);
                    }}
                    confirmMessage={`Delete "${c.name}" permanently? This cannot be undone.`}
                    className="rounded-full border border-brand-red/40 px-3 py-1 text-sm text-brand-red hover:bg-brand-red/5"
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
