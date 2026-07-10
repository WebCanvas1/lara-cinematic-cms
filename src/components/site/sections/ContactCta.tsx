import { Link } from "@tanstack/react-router";
import type { HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function ContactCta({ heading }: { heading?: HeadingConfig } = {}) {
  const h = mergeHeading(heading, {
    eyebrow: "Begin the Conversation",
    title: "Let's craft a film you'll treasure for a lifetime.",
    subtitle: "Enquiries open worldwide for weddings, elopements, and editorial commissions.",
  });
  return (
    <section className="bg-ink py-28 text-white">
      <div className="container-editorial mx-auto max-w-3xl text-center">
        <div className={h.wrapperCls} style={h.wrapperStyle}>
          {h.showEyebrow && (
            <div className="eyebrow mb-6" style={{ color: h.eyebrowStyle.color || "var(--color-gold)", fontSize: h.eyebrowStyle.fontSize }}>{h.eyebrow}</div>
          )}
          {h.showTitle && (
            <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl" style={h.titleStyle}>{h.title}</h2>
          )}
          {h.showSubtitle && (
            <p className="mx-auto mt-6 max-w-xl text-white/70" style={h.subtitleStyle}>{h.subtitle}</p>
          )}
        </div>
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