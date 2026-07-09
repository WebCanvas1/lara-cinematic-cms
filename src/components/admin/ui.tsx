import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.22em] text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none" />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none" />;
}
export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none" />;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-cream shadow-sm hover:bg-gold disabled:opacity-60" />;
}
export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] text-ink hover:border-ink" />;
}
export function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-5 py-2 text-[0.7rem] uppercase tracking-[0.24em] text-destructive hover:bg-destructive hover:text-destructive-foreground" />;
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>;
}