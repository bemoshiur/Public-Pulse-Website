// The recurring Dataplace CTA tell: an arrow inside a filled circle, trailing
// the button label. Two schemes so it reads on light and dark grounds.
type Props = {
  /** true = white circle w/ dark arrow (for dark/orange buttons). */
  onDark?: boolean;
  className?: string;
};

export function ArrowCircle({ onDark = false, className = "" }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-grid h-6 w-6 flex-shrink-0 place-items-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${
        onDark ? "bg-paper text-ink" : "bg-ink text-paper"
      } ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}
