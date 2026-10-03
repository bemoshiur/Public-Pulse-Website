import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">404</p>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-ink">Page not found</h1>
      <p className="mt-4 text-lg text-ink/70">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex items-center rounded-full bg-brand-orange px-6 py-3 font-semibold text-cp-gold-ink hover:opacity-90">
          Back to home
        </Link>
        <Link href="/services" className="inline-flex items-center rounded-full border border-ink/40 px-6 py-3 font-semibold text-ink hover:bg-brand-navy hover:text-white">
          Browse services
        </Link>
      </div>
    </div>
  );
}
