import { Link } from "@tanstack/react-router";

export function ContactCta() {
  return (
    <section className="bg-ink py-28 text-white">
      <div className="container-editorial mx-auto max-w-3xl text-center">
        <div className="eyebrow mb-6" style={{ color: "var(--color-gold)" }}>Begin the Conversation</div>
        <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
          Let&apos;s craft a film you&apos;ll treasure for a lifetime.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-white/70">
          Enquiries open worldwide for weddings, elopements, and editorial commissions.
        </p>
        <div className="mt-10">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-cream/70 px-9 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-cream transition-all hover:bg-cream hover:text-ink"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </section>
  );
}