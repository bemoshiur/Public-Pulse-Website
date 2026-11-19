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
        "ink": "#0B0C0B",
        "ink-soft": "#151715",
        "ink-mute": "#5A5C57",
        "paper": "#F2F0EA",
        "paper-alt": "#E9E6DD",
        "paper-tint": "#DCD8CC",
        "graphite": "#2A2C29",
        "brand-orange": "#CC261E",
        "brand-orange-soft": "#EE5A52",
        "brand-orange-deep": "#A81C16",
        // Legacy aliases (kept so any unmigrated markup still compiles).
        // They point at the new tokens so the visual stays correct.
        "brand-navy": "#0B0C0B",
        "brand-navy-soft": "#151715",
        "brand-teal": "#DE2A22",
        "brand-teal-soft": "#EE5A52",
        "brand-teal-deep": "#B81E17",
        "brand-teal-tint": "#F7D9D6",
        "brand-red": "#DE2A22",
        "surface-alt": "#E9E6DD",
        "surface-tint": "#DCD8CC",
        // Compat tokens for pages added after the design (election, pricing, work, flagship).
        "cp-edge": "#151815", "cp-deep": "#1A1D1A", "cp-mid": "#242824", "cp-core": "#2E332E",
        "cp-hot": "#DE2A22", "cp-line": "#DE2A22", "cp-gold": "#4BE38F", "cp-gold-soft": "#7DF0B0",
        "cp-gold-ink": "#FFFFFF", "cp-night": "#0B0C0B",
        "pr-paper": "#F2F0EA", "pr-surface": "#E9E6DD", "pr-raise": "#FFFFFF",
        "pr-ink": "#0B0C0B", "pr-ink-soft": "#2A2C29", "pr-muted": "#5A5C57", "pr-faint": "#8A8C86",
        "pr-hairline": "#D6D2C6", "pr-accent": "#C4231C", "pr-accent-ink": "#FFFFFF", "pr-accent-wash": "#F7D9D6",
        "pr-briefing": "#0B0C0B", "pr-briefing-ink": "#FFFFFF", "pr-briefing-muted": "#B9BBB5", "pr-briefing-line": "#2E332E",
        whatsapp: "#25D366",
        "brand-green": "#4BE38F",
        "brand-green-deep": "#2FB86F",
        // Category palette retained for service-card top borders only
        "cat-red": "#D32F2F",
        "cat-blue": "#1565C0",
        "cat-purple": "#6A1B9A",
        "cat-teal": "#0D9488",
        "cat-green": "#2E7D32",
        "cat-orange": "#DE2A22",
        "cat-navy": "#0A0A0A",
        "cat-brown": "#795548",
        "cat-magenta": "#AD1457",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-display)", "var(--font-archivo)", "system-ui", "sans-serif"],
        // serif aliased to sans so legacy markup compiles
        serif: ["var(--font-archivo)", "system-ui", "sans-serif"],
        "pr-serif": ["var(--font-archivo)", "system-ui", "sans-serif"],
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
        // Avoora-faithful: small 6px radius on buttons (was pill 9999px).
        // Pills feel SaaS-y; the small rectangle feels editorial.
        // Card stays 8px, panel 12px (close enough to avoora's quietly rounded forms).
        btn: "6px",
        card: "8px",
        panel: "12px",
        "panel-lg": "24px",
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
