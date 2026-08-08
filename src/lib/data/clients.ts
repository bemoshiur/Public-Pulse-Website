// Tagged cached read layer for clients. Public pages MUST use these
// accessors — never db.select() directly (docs/CACHING.md).

import { unstable_cache } from "next/cache";
import { asc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db/client";
import { clients, type Client } from "@/db/schema";

export const CLIENTS_TAG = "clients";

export const getClients = unstable_cache(
  async (): Promise<Client[]> => {
    try {
      return await db.select().from(clients).orderBy(asc(clients.name));
    } catch (err) {
      console.warn("[clients] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["clients:all-v1"],
  { tags: [CLIENTS_TAG], revalidate: 60 }
);

/** Clients that have a logo — drives the "trusted by" wall. */
export const getClientsWithLogos = unstable_cache(
  async (): Promise<Client[]> => {
    try {
      return await db.select().from(clients).where(isNotNull(clients.logoUrl)).orderBy(asc(clients.name));
    } catch (err) {
      console.warn("[clients] DB unavailable — returning empty list.", err instanceof Error ? err.message : err);
      return [];
    }
  },
  ["clients:with-logos-v1"],
  { tags: [CLIENTS_TAG], revalidate: 60 }
);

// ─── Admin-only (uncached) ───────────────────────────────────────────
export async function listAllClients(): Promise<Client[]> {
  return db.select().from(clients).orderBy(asc(clients.name));
}

export async function getClientById(id: string): Promise<Client | null> {
  const rows = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return rows[0] ?? null;
}
