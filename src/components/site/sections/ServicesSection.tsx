import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { Service } from "@/lib/site-types";

function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Film;
  return <Cmp className="h-5 w-5 text-[#c8a46d]" />;
}

export function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section className="bg-[#f5f5f4] px-6 py-24">
      <Reveal>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#c8a46d]">
            Services
          </p>
          <h2 className="font-serif text-4xl leading-tight text-black md:text-6xl">
            Every commission, crafted like an heirloom.
          </h2>
        </div>
      </Reveal>

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id ?? s.title ?? i} delay={i * 0.04}>
            <div className="h-full bg-white p-10 transition duration-300 hover:bg-[#faf8f3]">
              <Icon name={s.icon || "Film"} />

              <h3 className="mt-10 font-serif text-2xl leading-tight text-black">
                {s.title}
              </h3>

              {s.description && (
                <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-600">
                  {s.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
