"use client";

// Fires an `ai_referral` analytics event when a visitor arrives from an AI
// answer engine (ChatGPT, Perplexity, Gemini, Copilot, Claude, etc.). This is
// the on-site proof that AEO/GEO is working — a visit from chatgpt.com means an
// answer engine cited or linked us. Pair with a GA4 custom "AI answer engines"
// channel group for the full picture (see docs / JOURNEY hand-off).
//
// Runs once on first mount, referrer-only, zero network cost of its own.

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// host substring → friendly source label
const AI_REFERRERS: [string, string][] = [
  ["chatgpt.com", "ChatGPT"],
  ["chat.openai.com", "ChatGPT"],
  ["openai.com", "OpenAI"],
  ["perplexity.ai", "Perplexity"],
  ["gemini.google.com", "Gemini"],
  ["bard.google.com", "Gemini"],
  ["copilot.microsoft.com", "Copilot"],
  ["bing.com/chat", "Copilot"],
  ["claude.ai", "Claude"],
  ["you.com", "You.com"],
  ["poe.com", "Poe"],
  ["phind.com", "Phind"],
];

export function AiReferralTracker() {
  useEffect(() => {
    try {
      const ref = document.referrer;
      if (!ref) return;
      const hay = ref.toLowerCase();
      const hit = AI_REFERRERS.find(([host]) => hay.includes(host));
      if (!hit) return;
      track("ai_referral", {
        label: hit[1],
        surface: window.location.pathname,
        referrer: ref,
      });
    } catch {
      // never let analytics throw into the app
    }
  }, []);

  return null;
}
