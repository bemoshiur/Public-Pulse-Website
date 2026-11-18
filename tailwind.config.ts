import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Avoora-faithful palette (verified against avoora.webflow.io) ──
        // Ink: #111 (avoora exact). Was #0A0A0A — slightly too dark.
        // Brand orange: #FF5911 (avoora exact). Was #FF5C00 — close but not identical.
        // Body text: flat #5D5D5D (avoora exact). Use via `text-mute` token.
        // Dark grey: #4C4C4C — avoora's NEUTRAL primary-button colour.
        // ── Base palette rethemed to the "Dataplace direction" (restyle
        // Phase 0). White page + warm-grey inset panels + one VIVID orange
        // accent + near-black ink. Class names unchanged, so every page
        // inherits it. The political-ad flagship uses independent pr-* tokens
        // (unaffected). Surface greys sampled from Dataplace: #F6F7F7 / #F6F6F6
        // / #F3F4F5. Accent #FE4A0F (Dataplace exact — ~= the site's original
        // avoora orange). Body ink #212833; heading ink near-black.
        "ink": "rgb(var(--c-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--c-ink-soft) / <alpha-value>)",
        "ink-mute": "rgb(var(--c-ink-mute) / <alpha-value>)",
        "paper": "rgb(var(--c-paper) / <alpha-value>)",
        "paper-alt": "rgb(var(--c-paper-alt) / <alpha-value>)",
        "paper-tint": "rgb(var(--c-paper-tint) / <alpha-value>)",
        "graphite": "rgb(var(--c-graphite) / <alpha-value>)",
        "brand-orange": "rgb(var(--c-brand-orange) / <alpha-value>)",
        "brand-green": "rgb(var(--c-brand-green, 75 227 143) / <alpha-value>)",
        "brand-orange-soft": "rgb(var(--c-brand-orange-soft) / <alpha-value>)",
        "brand-orange-deep": "rgb(var(--c-brand-orange-deep) / <alpha-value>)",
        // ── Campaign palette — sampled from the "Public Pulse Profile | Political
        // PR" Canva brochure (public/downloads/…profile.pdf). Scoped to the
        // election / political-PR surfaces via .theme-campaign; the rest of the
        // site keeps the white + ink + orange identity.
        "cp-edge": "#151815",
        "cp-deep": "#1A1D1A",
        "cp-mid": "#242824",
        "cp-core": "#2E332E",
        "cp-hot": "#DE2A22",
        "cp-line": "#DE2A22",
        "cp-gold": "#4BE38F",
        "cp-gold-soft": "#7DF0B0",
        "cp-gold-ink": "#FFFFFF",
        "cp-night": "#0B0C0B",
        // ── Prestige palette — scoped to the political-ad flagship +
        // src/components/prestige/*. Rethemed to the Dataplace direction
        // (restyle) so the flagship matches the rest of the site: white +
        // warm-grey panels + vivid orange. Layout stays bespoke; palette only.
        "pr-paper": "rgb(var(--c-pr-paper) / <alpha-value>)",
        "pr-surface": "rgb(var(--c-pr-surface) / <alpha-value>)",
        "pr-raise": "rgb(var(--c-pr-raise) / <alpha-value>)",
        "pr-ink": "rgb(var(--c-pr-ink) / <alpha-value>)",
        "pr-ink-soft": "rgb(var(--c-pr-ink-soft) / <alpha-value>)",
        "pr-muted": "rgb(var(--c-pr-muted) / <alpha-value>)",
        "pr-faint": "rgb(var(--c-pr-faint) / <alpha-value>)",
        "pr-hairline": "rgb(var(--c-pr-hairline) / <alpha-value>)",
        "pr-accent": "rgb(var(--c-pr-accent) / <alpha-value>)",
        "pr-accent-ink": "rgb(var(--c-pr-accent-ink) / <alpha-value>)",
        "pr-accent-wash": "rgb(var(--c-pr-accent-wash) / <alpha-value>)",
        "pr-briefing": "rgb(var(--c-pr-briefing) / <alpha-value>)",
        "pr-briefing-ink": "rgb(var(--c-pr-briefing-ink) / <alpha-value>)",
        "pr-briefing-muted": "rgb(var(--c-pr-briefing-muted) / <alpha-value>)",
        "pr-briefing-line": "rgb(var(--c-pr-briefing-line) / <alpha-value>)",
        // Legacy aliases (kept so any unmigrated markup still compiles).
        // They point at the new Dataplace-direction tokens so the visual
        // stays correct wherever old class names still appear.
        "brand-navy": "rgb(var(--c-brand-navy) / <alpha-value>)",
        "brand-navy-soft": "rgb(var(--c-brand-navy-soft) / <alpha-value>)",
        "brand-teal": "rgb(var(--c-brand-teal) / <alpha-value>)",
        "brand-teal-soft": "rgb(var(--c-brand-teal-soft) / <alpha-value>)",
        "brand-teal-deep": "rgb(var(--c-brand-teal-deep) / <alpha-value>)",
        "brand-teal-tint": "rgb(var(--c-brand-teal-tint) / <alpha-value>)",
        "brand-red": "rgb(var(--c-brand-red) / <alpha-value>)",
        "surface-alt": "rgb(var(--c-surface-alt) / <alpha-value>)",
        "surface-tint": "rgb(var(--c-surface-tint) / <alpha-value>)",
        whatsapp: "#25D366",
        // Category palette retained for service-card top borders only
        "cat-red": "rgb(var(--c-cat-red) / <alpha-value>)",
        "cat-blue": "rgb(var(--c-cat-blue) / <alpha-value>)",
        "cat-purple": "rgb(var(--c-cat-purple) / <alpha-value>)",
        "cat-teal": "rgb(var(--c-cat-teal) / <alpha-value>)",
        "cat-green": "rgb(var(--c-cat-green) / <alpha-value>)",
        "cat-orange": "rgb(var(--c-cat-orange) / <alpha-value>)",
        "cat-navy": "rgb(var(--c-cat-navy) / <alpha-value>)",
        "cat-brown": "rgb(var(--c-cat-brown) / <alpha-value>)",
        "cat-magenta": "rgb(var(--c-cat-magenta) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        // serif aliased to sans so legacy markup compiles
        serif: ["var(--font-archivo)", "system-ui", "sans-serif"],
        // Prestige serif display (Fraunces, loaded in layout.tsx) + mono
        // "field-dossier" layer. Used by the political-ad flagship + prestige kit.
        "pr-serif": ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        // Avoora-faithful: editorial weight (500/600), VERY tight tracking.
        // Avoora's H1 sits at 129.6px / weight 500 / letter-spacing -8px.
        // Their H2 sits at 60px / weight 600 / letter-spacing -4px.
        // Each token carries its OWN font-weight default so callers don't
        // need to remember `font-medium` / `font-semibold` — and overrides
        // (`font-extrabold` etc.) still win when explicitly applied.
        mega: ["clamp(3.5rem, 7vw + 1rem, 8.5rem)", { lineHeight: "0.92", letterSpacing: "-0.06em", fontWeight: "500" }],
        display: ["clamp(2.75rem, 5vw + 1rem, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.055em", fontWeight: "500" }],
        h1: ["clamp(2.25rem, 3vw + 1rem, 4.25rem)", { lineHeight: "1.04", letterSpacing: "-0.045em", fontWeight: "500" }],
        h2: ["clamp(1.875rem, 2vw + 1rem, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.04em", fontWeight: "600" }],
        h3: ["clamp(1.25rem, 0.75vw + 1rem, 1.625rem)", { lineHeight: "1.22", letterSpacing: "-0.02em", fontWeight: "600" }],
        eyebrow: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.12em" }],
        lead: ["clamp(1.0625rem, 0.25vw + 1rem, 1.25rem)", { lineHeight: "1.55" }],
        body: ["1rem", { lineHeight: "1.6" }],
        meta: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        "display-number": [
          "clamp(3rem, 4vw + 2rem, 6rem)",
          { lineHeight: "1", letterSpacing: "-0.04em" },
        ],
      },
      maxWidth: {
        container: "1280px",
        prose: "65ch",
      },
      borderRadius: {
        // Dataplace direction: 200px pill buttons, soft-radius cards + panels.
        // The big soft radius on grey panels is the template's signature.
        btn: "9999px",
        card: "14px",
        panel: "20px",
        "panel-lg": "32px",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "float": "float 8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "gradient-drift": "gradient-drift 20s ease infinite",
        "icon-spin-slow": "spin 10s linear infinite",
        "rise": "rise 0.7s cubic-bezier(.16,1,.3,1) both",
        "fade-up": "fade-up 0.5s ease-out both",
        "shimmer": "shimmer 2s linear infinite",
        "tilt": "tilt 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.7", filter: "saturate(1)" },
          "50%": { opacity: "1", filter: "saturate(1.25)" },
        },
        "gradient-drift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
