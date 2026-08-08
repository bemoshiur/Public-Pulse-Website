import Link from "next/link";
import { listAllWorks } from "@/lib/data/works";
import { listAllClients } from "@/lib/data/clients";
import { deleteWork, togglePublishWork } from "./actions";
import { ConfirmButton } from "../_components/ConfirmButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const STATUS_STYLE: Record<string, string> = {
  published: "bg-cat-green/15 text-cat-green",
  review: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-500",
};

export default async function WorkPage() {
  const [rows, clients] = await Promise.all([listAllWorks(), listAllClients()]);
  const clientById = new Map(clients.map((c) => [c.id, c]));

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-medium text-brand-navy">Work</h1>
        <Link
          href="/manage/work/new"
          className="cta-primary inline-flex items-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white"
        >
          + New work
        </Link>
      </header>

      <p className="mt-3 text-sm text-slate-600">
        Published work appears on <code>/work</code>. Mutations call{" "}
        <code>updateTag(&apos;works&apos;)</code> so the public portfolio refreshes without redeploy.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No work yet. Create one to populate the /work portfolio.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((w) => {
            const client = w.clientId ? clientById.get(w.clientId) : undefined;
            const who =
              w.confidentiality === "anonymised"
                ? w.anonLabel || "Confidential client"
                : client?.name ?? "— no client —";

            return (
              <li key={w.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-xl font-medium text-brand-navy">{w.title}</h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          STATUS_STYLE[w.status] ?? STATUS_STYLE.draft
                        }`}
                      >
                        {w.status}
                      </span>
                      {w.featured && (
                        <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-meta uppercase text-slate-500">
                      {who} · {w.industrySlug ?? "no industry"} · {w.locationSlug ?? "no location"} · order{" "}
                      {w.displayOrder}
                    </p>
                    <p className="mt-3 text-slate-700">{w.summary}</p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Link
                      href={`/manage/work/${w.id}`}
                      className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <ConfirmButton
                      action={async () => {
                        "use server";
                        await togglePublishWork(w.id);
                      }}
                      confirmMessage={
                        w.status === "published"
                          ? `Unpublish "${w.title}"? It disappears from /work immediately.`
                          : `Publish "${w.title}"? It appears on /work immediately.`
                      }
                      className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
                    >
                      {w.status === "published" ? "Unpublish" : "Publish"}
                    </ConfirmButton>
                    <ConfirmButton
                      action={async () => {
                        "use server";
                        await deleteWork(w.id);
                      }}
                      confirmMessage={`Delete "${w.title}" permanently? This cannot be undone.`}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-sm text-brand-red hover:bg-brand-red/5"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
