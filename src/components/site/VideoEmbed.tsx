import { useState } from "react";
import { Play } from "lucide-react";

function parseEmbed(youtube?: string | null, vimeo?: string | null): string | null {
  if (youtube) {
    const m = youtube.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
  }
  if (vimeo) {
    const m = vimeo.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
  }
  return null;
}

export function VideoEmbed({
  youtube, vimeo, thumbnail, title,
}: { youtube?: string | null; vimeo?: string | null; thumbnail?: string | null; title: string }) {
  const [active, setActive] = useState(false);
  const src = parseEmbed(youtube, vimeo);

  if (active && src) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => src && setActive(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-mist shadow-md shadow-ink/10 transition-shadow hover:shadow-lg hover:shadow-ink/20"
      disabled={!src}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">No preview</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
      {src && (
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-ink">
          <Play className="h-5 w-5 translate-x-[2px] fill-current" />
        </span>
      )}
    </button>
  );
}