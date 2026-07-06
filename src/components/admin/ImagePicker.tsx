import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { compressToDataUrl } from "@/lib/image-upload";

export function ImagePicker({
  value, onChange, label = "Image",
}: { value: string; onChange: (val: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(files: FileList | null) {
    if (!files || !files[0]) return;
    setBusy(true);
    try {
      const dataUrl = await compressToDataUrl(files[0]);
      onChange(dataUrl);
    } catch {
      toast.error("Could not process image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-foreground/70">{label}</div>
      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border bg-mist">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute right-0 top-0 bg-ink p-1 text-background">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-dashed border-border bg-mist text-xs text-muted-foreground">
            None
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handle(e.target.files)} />
        <button
          type="button" disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-ink disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" /> {busy ? "Compressing…" : "Upload"}
        </button>
      </div>
    </div>
  );
}