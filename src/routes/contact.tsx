import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { z } from "zod";
import { siteBundleQuery } from "@/lib/queries";
import { submitEnquiry } from "@/lib/content.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteBundleQuery),
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Lara Cinematography" },
      { name: "description", content: "Enquire about wedding and destination cinematography with Lara." },
      { property: "og:title", content: "Contact — Lara Cinematography" },
      { property: "og:description", content: "Start a conversation about your film." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Please share your name"),
  email: z.string().trim().email("Please enter a valid email"),
  message: z.string().trim().min(1, "Please include a short message"),
});

function ContactPage() {
  const { data } = useSuspenseQuery(siteBundleQuery);
  const submit = useServerFn(submitEnquiry);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    const check = formSchema.safeParse(payload);
    if (!check.success) {
      toast.error(check.error.errors[0]?.message ?? "Please review the form");
      return;
    }
    setPending(true);
    try {
      await submit({
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone ?? "",
          event_date: payload.event_date ?? "",
          venue: payload.venue ?? "",
          service: payload.service ?? "",
          budget: payload.budget ?? "",
          message: payload.message,
        },
      });
      toast.success("Enquiry sent. Lara will be in touch shortly.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setPending(false);
    }
  }

  const wa = data.contact.whatsapp?.replace(/[^\d+]/g, "");

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">Contact</div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Begin the conversation.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-foreground/70">
            Enquiries open worldwide. Every message reaches Lara personally.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-editorial grid gap-16 md:grid-cols-5">
          <Reveal className="md:col-span-2">
            <div className="eyebrow mb-6">The Studio</div>
            <ul className="space-y-6 text-sm">
              {data.contact.email && (
                <li className="flex gap-4"><Mail className="mt-1 h-4 w-4 text-gold" /><a href={`mailto:${data.contact.email}`} className="hover:text-gold">{data.contact.email}</a></li>
              )}
              {data.contact.phone && (
                <li className="flex gap-4"><Phone className="mt-1 h-4 w-4 text-gold" /><a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="hover:text-gold">{data.contact.phone}</a></li>
              )}
              {data.contact.address && (
                <li className="flex gap-4"><MapPin className="mt-1 h-4 w-4 text-gold" />{data.contact.address}</li>
              )}
              {data.contact.hours && (
                <li className="flex gap-4"><Clock className="mt-1 h-4 w-4 text-gold" />{data.contact.hours}</li>
              )}
            </ul>
            <div className="mt-10 aspect-[4/3] w-full bg-mist">
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Map
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Wedding / Event Date" name="event_date" type="date" />
                <Field label="Venue" name="venue" />
                <Field label="Service" name="service" as="select"
                  options={data.services.map((s) => s.title).concat(["Other"])} />
                <Field label="Estimated Budget" name="budget" as="select"
                  options={["Under £2,500", "£2,500 – £5,000", "£5,000 – £8,000", "£8,000 – £12,000", "£12,000+"]} />
              </div>
              <Field label="Message" name="message" as="textarea" required rows={5} />
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-background transition-all hover:bg-gold disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Submit Enquiry"}
                </button>
                {wa && (
                  <a
                    href={`https://wa.me/${wa.replace(/^\+/, "")}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ink hover:bg-ink hover:text-background"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label, name, type = "text", required, as, options, rows,
}: {
  label: string; name: string; type?: string; required?: boolean;
  as?: "textarea" | "select"; options?: string[]; rows?: number;
}) {
  const base = "w-full border border-border bg-transparent px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none";
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.24em] text-foreground/70">
        {label}{required && <span className="text-gold"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea name={name} required={required} rows={rows} className={base} />
      ) : as === "select" ? (
        <select name={name} className={base} defaultValue="">
          <option value="">Select…</option>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} required={required} className={base} />
      )}
    </label>
  );
}