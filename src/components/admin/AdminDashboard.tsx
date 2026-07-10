import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LogOut, ExternalLink, Plus, Trash2, GripVertical, Save } from "lucide-react";
import {
  DndContext, PointerSensor, useSensor, useSensors, closestCenter, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { adminAllQuery } from "@/lib/admin-queries";
import {
  upsertContent, upsertSettings, upsertService, deleteService,
  upsertPortfolio, deletePortfolio, upsertGalleryItem, deleteGalleryItem,
  upsertTestimonial, deleteTestimonial, reorderItems, deleteEnquiry,
  upsertPackage, deletePackage, upsertAddon, deleteAddon, saveHomepageLayout,
} from "@/lib/content.functions";
import { lockAdmin } from "@/lib/admin.functions";
import { compressToDataUrl } from "@/lib/image-upload";
import { ImagePicker } from "./ImagePicker";
import { PageHeader, Field, TextInput, TextArea, SelectInput, PrimaryButton, SecondaryButton, DangerButton, Card } from "./ui";
import { PORTFOLIO_CATEGORIES, GALLERY_CATEGORIES, DEFAULT_HOMEPAGE_SECTIONS, type Service, type PortfolioItem, type GalleryItem, type Testimonial, type PackageItem, type AddOnItem, type HomepageSection, type HeadingConfig } from "@/lib/site-types";

const TABS = ["Overview", "Homepage Layout", "Hero", "About", "Services", "Packages", "Add-ons", "Portfolio", "Gallery", "Testimonials", "Why Choose", "Contact & Social", "Footer", "Enquiries"] as const;
type Tab = typeof TABS[number];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("Overview");
  const qc = useQueryClient();
  const navigate = useNavigate();
  const lock = useServerFn(lockAdmin);
  const { data, isLoading } = useQuery(adminAllQuery);

  async function handleLogout() {
    await lock();
    qc.clear();
    toast.success("Signed out");
    navigate({ to: "/admin/unlock" });
  }

  const bundle = data;
  const bySection = (rows: { key: string; value: unknown }[] | undefined, key: string) =>
    (rows?.find((r) => r.key === key)?.value as any) ?? {};

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl text-ink">Lara</span>
            <span className="text-[0.65rem] uppercase tracking-[0.28em] text-gold">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-ink">
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </a>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-ink">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto px-6">
          <div className="flex gap-1 pb-3">
            {TABS.map((t) => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-[0.22em] transition-colors ${
                  tab === t ? "border-b-2 border-gold text-ink" : "text-foreground/60 hover:text-ink"
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isLoading || !bundle ? (
          <p className="py-24 text-center text-muted-foreground">Loading…</p>
        ) : (
          <>
            {tab === "Overview" && <Overview bundle={bundle} />}
            {tab === "Homepage Layout" && <HomepageLayoutTab items={((bundle as any).layout ?? []) as HomepageSection[]} />}
            {tab === "Hero" && <SectionEditor sectionKey="hero" initial={bySection(bundle.content, "hero")} table="site_content" fields={HERO_FIELDS} />}
            {tab === "About" && <SectionEditor sectionKey="about" initial={bySection(bundle.content, "about")} table="site_content" fields={ABOUT_FIELDS} />}
            {tab === "Services" && <ServicesTab services={bundle.services as Service[]} />}
            {tab === "Packages" && <PackagesTab items={(bundle.packages ?? []) as PackageItem[]} />}
            {tab === "Add-ons" && <AddOnsTab items={(bundle.addons ?? []) as AddOnItem[]} />}
            {tab === "Portfolio" && <PortfolioTab items={bundle.portfolio as PortfolioItem[]} />}
            {tab === "Gallery" && <GalleryTab items={bundle.gallery as GalleryItem[]} />}
            {tab === "Testimonials" && <TestimonialsTab items={bundle.testimonials as Testimonial[]} />}
            {tab === "Why Choose" && <WhyChooseTab initial={bySection(bundle.content, "why_choose")} />}
            {tab === "Contact & Social" && <ContactSocialTab settings={bundle.settings} />}
            {tab === "Footer" && <SectionEditor sectionKey="footer" initial={bySection(bundle.content, "footer")} table="site_content" fields={FOOTER_FIELDS} />}
            {tab === "Enquiries" && <EnquiriesTab enquiries={bundle.enquiries as any} />}
          </>
        )}
      </main>
    </div>
  );
}

// -------------- Overview --------------
function Overview({ bundle }: { bundle: any }) {
  const stats = [
    { label: "Portfolio films", value: bundle.portfolio.length },
    { label: "Gallery images", value: bundle.gallery.length },
    { label: "Services", value: bundle.services.length },
    { label: "Testimonials", value: bundle.testimonials.length },
    { label: "Enquiries", value: bundle.enquiries.length },
  ];
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Manage everything on your website from here." />
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-[0.65rem] uppercase tracking-[0.24em] text-gold">{s.label}</div>
            <div className="mt-2 font-serif text-4xl text-ink">{s.value}</div>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <h3 className="mb-4 font-serif text-xl text-ink">Recent enquiries</h3>
        {bundle.enquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <div className="border border-border bg-background">
            {bundle.enquiries.slice(0, 5).map((e: any) => (
              <div key={e.id} className="border-b border-border p-4 last:border-b-0">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-ink">{e.name} — {e.email}</span>
                  <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-foreground/70">{e.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------- Generic section editor for site_content JSON --------------
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "image" | "select"; options?: string[] };
const HERO_FIELDS: FieldDef[] = [
  { key: "heading", label: "Heading", type: "textarea" },
  { key: "subheading", label: "Subheading", type: "textarea" },
  { key: "background_type", label: "Background type", type: "select", options: ["image", "video"] },
  { key: "background_url", label: "Background URL (image or video). Leave empty for default hero image; paste any URL for video.", type: "text" },
  { key: "cta_primary_label", label: "Primary CTA label", type: "text" },
  { key: "cta_primary_href", label: "Primary CTA link", type: "text" },
  { key: "cta_secondary_label", label: "Secondary CTA label", type: "text" },
  { key: "cta_secondary_href", label: "Secondary CTA link", type: "text" },
];
const ABOUT_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "portrait_url", label: "Portrait", type: "image" },
  { key: "story", label: "Story", type: "textarea" },
  { key: "mission", label: "Mission", type: "textarea" },
  { key: "approach", label: "Approach", type: "textarea" },
  { key: "experience", label: "Experience", type: "textarea" },
];
const FOOTER_FIELDS: FieldDef[] = [
  { key: "tagline", label: "Footer tagline", type: "text" },
  { key: "copyright", label: "Copyright text", type: "text" },
];

function SectionEditor({ sectionKey, initial, table, fields }: {
  sectionKey: string; initial: Record<string, any>; table: "site_content" | "settings"; fields: FieldDef[];
}) {
  const qc = useQueryClient();
  const upsertC = useServerFn(upsertContent);
  const upsertS = useServerFn(upsertSettings);
  const [state, setState] = useState<Record<string, any>>(() => ({ ...initial }));
  const mut = useMutation({
    mutationFn: async () => {
      const fn = table === "site_content" ? upsertC : upsertS;
      await fn({ data: { key: sectionKey, value: state } });
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries(); },
    onError: () => toast.error("Could not save"),
  });
  return (
    <div>
      <PageHeader title={sectionKey.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())} actions={
        <PrimaryButton onClick={() => mut.mutate()} disabled={mut.isPending}><Save className="h-3.5 w-3.5" /> {mut.isPending ? "Saving…" : "Save"}</PrimaryButton>
      } />
      <div className="space-y-5">
        {fields.map((f) => (
          <Card key={f.key}>
            {f.type === "image" ? (
              <ImagePicker label={f.label} value={state[f.key] || ""} onChange={(v) => setState({ ...state, [f.key]: v })} />
            ) : (
              <Field label={f.label}>
                {f.type === "textarea" ? (
                  <TextArea rows={4} value={state[f.key] || ""} onChange={(e) => setState({ ...state, [f.key]: e.target.value })} />
                ) : f.type === "select" ? (
                  <SelectInput value={state[f.key] || ""} onChange={(e) => setState({ ...state, [f.key]: e.target.value })}>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </SelectInput>
                ) : (
                  <TextInput value={state[f.key] || ""} onChange={(e) => setState({ ...state, [f.key]: e.target.value })} />
                )}
              </Field>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// -------------- Sortable list --------------
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="border border-border bg-background">
      <div className="flex items-start gap-3 p-4">
        <button {...attributes} {...listeners} className="mt-2 cursor-grab text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function useSortableItems<T extends { id: string }>(
  items: T[], table: "services" | "portfolio" | "gallery" | "testimonials" | "packages" | "addons",
) {
  const [order, setOrder] = useState(items.map((i) => i.id));
  useMemo(() => setOrder(items.map((i) => i.id)), [items]);
  const reorder = useServerFn(reorderItems);
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id)));
    setOrder(next);
    reorder({ data: { table, ids: next } })
      .then(() => { toast.success("Order saved"); qc.invalidateQueries(); })
      .catch(() => toast.error("Could not reorder"));
  }
  const sortedItems = order.map((id) => items.find((i) => i.id === id)).filter(Boolean) as T[];
  return { sortedItems, onDragEnd, sensors, order };
}

// -------------- Services --------------
function ServicesTab({ services }: { services: Service[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const { sortedItems, onDragEnd, sensors, order } = useSortableItems(services, "services");
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  async function save(s: Partial<Service>) {
    await up({ data: { title: s.title || "", description: s.description || "", icon: s.icon || "Sparkles",
      sort_order: s.sort_order ?? services.length, active: s.active ?? true, id: s.id } });
    setEditing(null); qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Services" actions={
        <PrimaryButton onClick={() => setEditing({ title: "", description: "", icon: "Sparkles", active: true, sort_order: services.length })}>
          <Plus className="h-3.5 w-3.5" /> New service
        </PrimaryButton>
      } />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map((s) => (
              <SortableItem key={s.id} id={s.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-lg text-ink">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.icon} · {s.active ? "Active" : "Hidden"}</div>
                    <p className="mt-1 text-sm text-foreground/70">{s.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => setEditing(s)}>Edit</SecondaryButton>
                    <DangerButton onClick={async () => {
                      if (!confirm("Delete this service?")) return;
                      await del({ data: { id: s.id } }); qc.invalidateQueries(); toast.success("Deleted");
                    }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit service" : "New service"}>
        <Field label="Title"><TextInput value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
        <Field label="Description"><TextArea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
        <Field label="Icon (any Lucide icon name, e.g. Heart, Plane, Camera)"><TextInput value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
        <div className="mt-4 flex justify-end gap-2"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => save(editing)}>Save</PrimaryButton></div>
      </Modal>}
    </div>
  );
}

// -------------- Portfolio --------------
function PortfolioTab({ items }: { items: PortfolioItem[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertPortfolio);
  const del = useServerFn(deletePortfolio);
  const { sortedItems, onDragEnd, sensors, order } = useSortableItems(items, "portfolio");
  const [editing, setEditing] = useState<Partial<PortfolioItem> | null>(null);

  async function save(v: Partial<PortfolioItem>) {
    await up({ data: {
      id: v.id, title: v.title || "Untitled", category: v.category || "Weddings", description: v.description || "",
      youtube_url: v.youtube_url || null, vimeo_url: v.vimeo_url || null,
      thumbnail_url: v.thumbnail_url || null, cover_url: v.cover_url || null,
      featured: v.featured ?? false, sort_order: v.sort_order ?? items.length,
    }});
    setEditing(null); qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Portfolio" subtitle="Films appear on the portfolio page. Featured films also show on the homepage." actions={
        <PrimaryButton onClick={() => setEditing({ title: "", category: "Weddings", featured: false, sort_order: items.length })}>
          <Plus className="h-3.5 w-3.5" /> New film
        </PrimaryButton>
      } />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map((p) => (
              <SortableItem key={p.id} id={p.id}>
                <div className="flex flex-wrap items-start gap-4">
                  {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="h-20 w-32 object-cover" />}
                  <div className="flex-1">
                    <div className="font-serif text-lg text-ink">{p.title} {p.featured && <span className="ml-2 text-[0.65rem] uppercase tracking-widest text-gold">Featured</span>}</div>
                    <div className="text-xs text-muted-foreground">{p.category}</div>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground/70">{p.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => setEditing(p)}>Edit</SecondaryButton>
                    <DangerButton onClick={async () => {
                      if (!confirm("Delete this film?")) return;
                      await del({ data: { id: p.id } }); qc.invalidateQueries(); toast.success("Deleted");
                    }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit film" : "New film"}>
        <Field label="Title"><TextInput value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
        <Field label="Category">
          <SelectInput value={editing.category || "Weddings"} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
            {PORTFOLIO_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </SelectInput>
        </Field>
        <Field label="Description"><TextArea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
        <Field label="YouTube URL"><TextInput value={editing.youtube_url || ""} onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })} /></Field>
        <Field label="Vimeo URL"><TextInput value={editing.vimeo_url || ""} onChange={(e) => setEditing({ ...editing, vimeo_url: e.target.value })} /></Field>
        <ImagePicker label="Thumbnail" value={editing.thumbnail_url || ""} onChange={(v) => setEditing({ ...editing, thumbnail_url: v })} />
        <ImagePicker label="Cover image" value={editing.cover_url || ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Feature on homepage</label>
        <div className="mt-4 flex justify-end gap-2"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => save(editing)}>Save</PrimaryButton></div>
      </Modal>}
    </div>
  );
}

// -------------- Gallery --------------
function GalleryTab({ items }: { items: GalleryItem[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertGalleryItem);
  const del = useServerFn(deleteGalleryItem);
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      let order = items.length;
      for (const file of Array.from(files)) {
        const dataUrl = await compressToDataUrl(file);
        await up({ data: { image_url: dataUrl, alt: file.name.replace(/\.[^.]+$/, ""), category: "Weddings", featured: false, sort_order: order++ } });
      }
      qc.invalidateQueries(); toast.success("Images uploaded");
    } catch { toast.error("Upload failed"); } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader title="Gallery" actions={
        <label className="inline-flex cursor-pointer items-center gap-2 bg-ink px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-background hover:bg-gold">
          <Plus className="h-3.5 w-3.5" /> {busy ? "Uploading…" : "Upload images"}
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
      } />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="group relative border border-border bg-background">
            <img src={g.image_url} alt={g.alt} className="aspect-square w-full object-cover" />
            <div className="p-2 space-y-2">
              <TextInput value={g.alt} onChange={async (e) => {
                await up({ data: { ...g, alt: e.target.value } });
                qc.invalidateQueries();
              }} placeholder="Alt text" />
              <SelectInput value={g.category} onChange={async (e) => {
                await up({ data: { ...g, category: e.target.value } });
                qc.invalidateQueries();
              }}>
                {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </SelectInput>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={g.featured} onChange={async (e) => {
                  await up({ data: { ...g, featured: e.target.checked } });
                  qc.invalidateQueries();
                }} /> Featured
              </label>
              <DangerButton onClick={async () => {
                if (!confirm("Delete this image?")) return;
                await del({ data: { id: g.id } }); qc.invalidateQueries();
              }}><Trash2 className="h-3 w-3" /> Delete</DangerButton>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No images yet — upload some to get started.</p>}
    </div>
  );
}

// -------------- Testimonials --------------
function TestimonialsTab({ items }: { items: Testimonial[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertTestimonial);
  const del = useServerFn(deleteTestimonial);
  const { sortedItems, onDragEnd, sensors, order } = useSortableItems(items, "testimonials");
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  async function save(t: Partial<Testimonial>) {
    await up({ data: { id: t.id, name: t.name || "", role: t.role || "", quote: t.quote || "", avatar_url: t.avatar_url || null, sort_order: t.sort_order ?? items.length } });
    setEditing(null); qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Testimonials" actions={
        <PrimaryButton onClick={() => setEditing({ name: "", role: "", quote: "", sort_order: items.length })}>
          <Plus className="h-3.5 w-3.5" /> New testimonial
        </PrimaryButton>
      } />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map((t) => (
              <SortableItem key={t.id} id={t.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-serif text-base italic text-ink">"{t.quote}"</div>
                    <div className="mt-2 text-xs uppercase tracking-widest text-foreground/60">— {t.name}{t.role ? `, ${t.role}` : ""}</div>
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => setEditing(t)}>Edit</SecondaryButton>
                    <DangerButton onClick={async () => {
                      if (!confirm("Delete this testimonial?")) return;
                      await del({ data: { id: t.id } }); qc.invalidateQueries();
                    }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit testimonial" : "New testimonial"}>
        <Field label="Name"><TextInput value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
        <Field label="Role / context"><TextInput value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></Field>
        <Field label="Quote"><TextArea rows={4} value={editing.quote || ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></Field>
        <div className="mt-4 flex justify-end gap-2"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => save(editing)}>Save</PrimaryButton></div>
      </Modal>}
    </div>
  );
}

// -------------- Why Choose --------------
function WhyChooseTab({ initial }: { initial: { items?: { icon: string; title: string; description: string }[] } }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertContent);
  const [items, setItems] = useState(initial.items ?? []);

  async function save() {
    await up({ data: { key: "why_choose", value: { items } } });
    qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Why Choose" actions={
        <>
          <SecondaryButton onClick={() => setItems([...items, { icon: "Sparkles", title: "New feature", description: "Description" }])}>
            <Plus className="h-3.5 w-3.5" /> Add
          </SecondaryButton>
          <PrimaryButton onClick={save}><Save className="h-3.5 w-3.5" /> Save all</PrimaryButton>
        </>
      } />
      <div className="space-y-3">
        {items.map((it, i) => (
          <Card key={i}>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Icon (Lucide name)"><TextInput value={it.icon} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} /></Field>
              <Field label="Title"><TextInput value={it.title} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} /></Field>
              <Field label="Description"><TextInput value={it.description} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} /></Field>
            </div>
            <div className="mt-3 text-right">
              <DangerButton onClick={() => setItems(items.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// -------------- Contact & Social --------------
function ContactSocialTab({ settings }: { settings: { key: string; value: any }[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertSettings);
  const bySection = (k: string) => settings.find((s) => s.key === k)?.value ?? {};
  const [contact, setContact] = useState(bySection("contact"));
  const [social, setSocial] = useState(bySection("social"));

  async function save() {
    await Promise.all([
      up({ data: { key: "contact", value: contact } }),
      up({ data: { key: "social", value: social } }),
    ]);
    qc.invalidateQueries(); toast.success("Saved");
  }

  const contactFields: [string, string][] = [["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp (with country code)"], ["address", "Address"], ["hours", "Business hours"]];
  const socialFields: [string, string][] = [["instagram", "Instagram URL"], ["facebook", "Facebook URL"], ["youtube", "YouTube URL"], ["tiktok", "TikTok URL"], ["vimeo", "Vimeo URL"]];

  return (
    <div>
      <PageHeader title="Contact & Social" actions={<PrimaryButton onClick={save}><Save className="h-3.5 w-3.5" /> Save</PrimaryButton>} />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-serif text-lg">Contact details</h3>
          <div className="space-y-4">
            {contactFields.map(([k, l]) => (
              <Field key={k} label={l}><TextInput value={contact[k] || ""} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} /></Field>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-serif text-lg">Social links</h3>
          <div className="space-y-4">
            {socialFields.map(([k, l]) => (
              <Field key={k} label={l}><TextInput value={social[k] || ""} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} /></Field>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// -------------- Enquiries --------------
function EnquiriesTab({ enquiries }: { enquiries: any[] }) {
  const qc = useQueryClient();
  const del = useServerFn(deleteEnquiry);
  return (
    <div>
      <PageHeader title="Enquiries" subtitle={`${enquiries.length} total (most recent 200 shown)`} />
      {enquiries.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-serif text-lg text-ink">{e.name}</div>
                  <div className="text-xs text-muted-foreground">
                    <a href={`mailto:${e.email}`} className="hover:text-gold">{e.email}</a>
                    {e.phone && <> · {e.phone}</>}
                    {e.event_date && <> · {e.event_date}</>}
                    {e.service && <> · {e.service}</>}
                    {e.budget && <> · {e.budget}</>}
                  </div>
                  {e.venue && <div className="mt-1 text-xs text-muted-foreground">Venue: {e.venue}</div>}
                  <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">{e.message}</p>
                  <div className="mt-2 text-[0.65rem] uppercase tracking-widest text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                </div>
                <DangerButton onClick={async () => {
                  if (!confirm("Delete this enquiry?")) return;
                  await del({ data: { id: e.id } }); qc.invalidateQueries();
                }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------- Modal --------------
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-background p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-6 font-serif text-2xl text-ink">{title}</h3>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

// -------------- Packages --------------
function PackagesTab({ items }: { items: PackageItem[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertPackage);
  const del = useServerFn(deletePackage);
  const { sortedItems, onDragEnd, sensors, order } = useSortableItems(items, "packages");
  const [editing, setEditing] = useState<Partial<PackageItem> | null>(null);

  async function save(v: Partial<PackageItem>) {
    await up({ data: {
      id: v.id,
      name: v.name || "Untitled",
      subtitle: v.subtitle || "",
      price: v.price || "",
      image: v.image || "",
      badge: v.badge || "",
      description: v.description || "",
      features: v.features || [],
      buttonText: v.buttonText || "Enquire Now",
      buttonLink: v.buttonLink || "/contact",
      active: v.active ?? true,
      featured: v.featured ?? false,
      sort_order: v.sort_order ?? items.length,
    }});
    setEditing(null); qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Packages" subtitle="Investment tiers shown on the homepage." actions={
        <PrimaryButton onClick={() => setEditing({ name: "", subtitle: "", price: "", features: [], buttonText: "Enquire Now", buttonLink: "/contact", active: true, featured: false, sort_order: items.length })}>
          <Plus className="h-3.5 w-3.5" /> New package
        </PrimaryButton>
      } />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map((p) => (
              <SortableItem key={p.id} id={p.id}>
                <div className="flex flex-wrap items-start gap-4">
                  {p.image && <img src={p.image} alt="" className="h-20 w-28 object-cover" />}
                  <div className="flex-1">
                    <div className="font-serif text-lg text-ink">
                      {p.name}
                      {p.featured && <span className="ml-2 text-[0.65rem] uppercase tracking-widest text-gold">{p.badge || "Most Popular"}</span>}
                      {!p.active && <span className="ml-2 text-[0.65rem] uppercase tracking-widest text-muted-foreground">Hidden</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.subtitle} · {p.price}</div>
                    {p.description && <p className="mt-1 line-clamp-2 text-sm text-foreground/70">{p.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => setEditing(p)}>Edit</SecondaryButton>
                    <DangerButton onClick={async () => {
                      if (!confirm("Delete this package?")) return;
                      await del({ data: { id: p.id } }); qc.invalidateQueries(); toast.success("Deleted");
                    }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit package" : "New package"}>
        <Field label="Name"><TextInput value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
        <Field label="Subtitle"><TextInput value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></Field>
        <Field label="Price (e.g. £2,250)"><TextInput value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
        <Field label="Badge text (e.g. Most Popular)"><TextInput value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} /></Field>
        <Field label="Description"><TextArea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
        <ImagePicker label="Package image" value={editing.image || ""} onChange={(v) => setEditing({ ...editing, image: v })} />
        <FeaturesEditor
          features={editing.features || []}
          onChange={(features) => setEditing({ ...editing, features })}
        />
        <Field label="Button text"><TextInput value={editing.buttonText || ""} onChange={(e) => setEditing({ ...editing, buttonText: e.target.value })} /></Field>
        <Field label="Button link"><TextInput value={editing.buttonLink || ""} onChange={(e) => setEditing({ ...editing, buttonLink: e.target.value })} /></Field>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured (Most Popular)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
        </div>
        <div className="mt-4 flex justify-end gap-2"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => save(editing)}>Save</PrimaryButton></div>
      </Modal>}
    </div>
  );
}

function FeaturesEditor({ features, onChange }: { features: string[]; onChange: (f: string[]) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-foreground/70">Feature list</div>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={f} onChange={(e) => onChange(features.map((x, idx) => idx === i ? e.target.value : x))} />
            <DangerButton onClick={() => onChange(features.filter((_, idx) => idx !== i))}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
          </div>
        ))}
        <SecondaryButton onClick={() => onChange([...features, ""])}><Plus className="h-3.5 w-3.5" /> Add feature</SecondaryButton>
      </div>
    </div>
  );
}

// -------------- Add-ons --------------
function AddOnsTab({ items }: { items: AddOnItem[] }) {
  const qc = useQueryClient();
  const up = useServerFn(upsertAddon);
  const del = useServerFn(deleteAddon);
  const { sortedItems, onDragEnd, sensors, order } = useSortableItems(items, "addons");
  const [editing, setEditing] = useState<Partial<AddOnItem> | null>(null);

  async function save(v: Partial<AddOnItem>) {
    await up({ data: {
      id: v.id,
      title: v.title || "Untitled",
      description: v.description || "",
      price: v.price || "",
      icon: v.icon || "Sparkles",
      active: v.active ?? true,
      sort_order: v.sort_order ?? items.length,
    }});
    setEditing(null); qc.invalidateQueries(); toast.success("Saved");
  }

  return (
    <div>
      <PageHeader title="Add-ons" subtitle="Optional enhancements shown beneath the packages." actions={
        <PrimaryButton onClick={() => setEditing({ title: "", description: "", price: "", icon: "Sparkles", active: true, sort_order: items.length })}>
          <Plus className="h-3.5 w-3.5" /> New add-on
        </PrimaryButton>
      } />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sortedItems.map((a) => (
              <SortableItem key={a.id} id={a.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-serif text-lg text-ink">{a.title} <span className="ml-2 text-sm text-gold">{a.price}</span></div>
                    <div className="text-xs text-muted-foreground">{a.icon} · {a.active ? "Active" : "Hidden"}</div>
                    <p className="mt-1 text-sm text-foreground/70">{a.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton onClick={() => setEditing(a)}>Edit</SecondaryButton>
                    <DangerButton onClick={async () => {
                      if (!confirm("Delete this add-on?")) return;
                      await del({ data: { id: a.id } }); qc.invalidateQueries(); toast.success("Deleted");
                    }}><Trash2 className="h-3.5 w-3.5" /></DangerButton>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit add-on" : "New add-on"}>
        <Field label="Title"><TextInput value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
        <Field label="Description"><TextArea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
        <Field label="Price"><TextInput value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
        <Field label="Icon (any Lucide icon name, e.g. Clock, Film, Plane, Camera)"><TextInput value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
        <div className="mt-4 flex justify-end gap-2"><SecondaryButton onClick={() => setEditing(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => save(editing)}>Save</PrimaryButton></div>
      </Modal>}
    </div>
  );
}