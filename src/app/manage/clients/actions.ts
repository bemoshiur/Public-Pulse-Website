"use server";

// All client mutations live here. Every successful mutation MUST call
// updateTag(CLIENTS_TAG) so /work (the client-logo wall + portfolio) picks
// up the change. See docs/CACHING.md.
//
// NOTE: there is no shared `@/app/manage/_lib/session` module in this repo.
// requireSession() is defined locally in every manage/*/actions.ts file
// (see case-studies/actions.ts, team/actions.ts) — replicated here.

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { eq, and, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { clients } from "@/db/schema";
import { CLIENTS_TAG } from "@/lib/data/clients";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/manage/sign-in");
}

// logoUrl / logoDarkUrl accept relative paths (e.g. "/logos/client.svg")
// as well as absolute URLs — matching the convention already used for
// logoUrl/heroImageUrl in case-studies/actions.ts. website is an external
// link, so it's validated as a full URL.
const clientSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  name: z.string().min(1, "Name is required.").max(180),
  logoUrl: z.string().max(500).optional().or(z.literal("")),
  logoDarkUrl: z.string().max(500).optional().or(z.literal("")),
  website: z.string().url("Enter a full URL, e.g. https://example.com").max(500).optional().or(z.literal("")),
});

function parse(formData: FormData) {
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${String(i.path[0])}: ${i.message}`).join("; "));
  }
  const d = parsed.data;
  return {
    slug: d.slug,
    name: d.name,
    logoUrl: d.logoUrl || null,
    logoDarkUrl: d.logoDarkUrl || null,
    website: d.website || null,
  };
}

function refreshPublic() {
  updateTag(CLIENTS_TAG);
  revalidatePath("/work");
}

/** Slug is unique (clients_slug_idx). Fail with a clean message instead of
 *  letting a raw Postgres constraint error reach the admin. */
async function assertSlugAvailable(slug: string, excludeId?: string) {
  const rows = await db
    .select({ id: clients.id })
    .from(clients)
    .where(excludeId ? and(eq(clients.slug, slug), ne(clients.id, excludeId)) : eq(clients.slug, slug))
    .limit(1);
  if (rows.length > 0) {
    throw new Error(`A client with slug "${slug}" already exists. Choose a different slug.`);
  }
}

/** Defense-in-depth against a race between the pre-check above and the
 *  write below: translate a unique-constraint violation into the same
 *  friendly message rather than letting the raw DB error bubble up. */
function friendlySlugConflict(slug: string, err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("clients_slug_idx") || /duplicate key/i.test(message)) {
    throw new Error(`A client with slug "${slug}" already exists. Choose a different slug.`);
  }
  throw err instanceof Error ? err : new Error(message);
}

export async function createClient(formData: FormData): Promise<void> {
  await requireSession();
  const data = parse(formData);
  await assertSlugAvailable(data.slug);
  try {
    await db.insert(clients).values(data);
  } catch (err) {
    friendlySlugConflict(data.slug, err);
  }
  refreshPublic();
  redirect("/manage/clients");
}

export async function updateClient(id: string, formData: FormData): Promise<void> {
  await requireSession();
  const data = parse(formData);
  await assertSlugAvailable(data.slug, id);
  try {
    await db
      .update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clients.id, id));
  } catch (err) {
    friendlySlugConflict(data.slug, err);
  }
  refreshPublic();
  redirect("/manage/clients");
}

export async function deleteClient(id: string): Promise<void> {
  await requireSession();
  try {
    await db.delete(clients).where(eq(clients.id, id));
  } catch (err) {
    // works.client_id is ON DELETE RESTRICT — a client still linked to a
    // work item throws a Postgres FK-violation error. Translate it.
    const message = err instanceof Error ? err.message : String(err);
    if (/foreign key|violates.*constraint/i.test(message)) {
      throw new Error(
        "This client is linked to one or more work items and can't be deleted. Unlink or delete those first."
      );
    }
    throw err instanceof Error ? err : new Error(message);
  }
  refreshPublic();
  revalidatePath("/manage/clients");
}
