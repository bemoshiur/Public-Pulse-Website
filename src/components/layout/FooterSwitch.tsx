"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Renders the Bengali footer on /bn/* and the English footer elsewhere.
// Both are server-rendered and passed in as props, so no extra client JS.
export function FooterSwitch({ en, bn }: { en: ReactNode; bn: ReactNode }) {
  const p = usePathname() || "/";
  return <>{p === "/bn" || p.startsWith("/bn/") ? bn : en}</>;
}
