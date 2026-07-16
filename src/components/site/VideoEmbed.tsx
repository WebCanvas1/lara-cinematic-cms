import { useState } from "react";
import { Play } from "lucide-react";

function parseEmbed(
  youtube?: string | null,
  vimeo?: string | null,
): string | null {
  if (youtube) {
    const match = youtube.match(
      /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/,
    );

    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }

  if (vimeo) {
    const match = vimeo.match(
      /vimeo\.com\/(?:video\/)?(\d+)/,
    );

    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
    }
  }

  return null;
}

function getVideoType(url?: string | null): string | undefined {
  if (!url) return undefined;

  const cleanUrl = url.split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".mp4")) return "video/mp4";
  if (cleanUrl.endsWith(".webm")) return "video/webm";
  if (cleanUrl.endsWith(".ogg") || cleanUrl.endsWith(".ogv")) {
    return "video/ogg";
  }

  if (cleanUrl.endsWith(".m3u8")) {
    return "application/x-mpegURL";
  }

  return undefined;
}

export function VideoEmbed({
  youtube,
  vimeo,
  videoUrl,
  thumbnail,
  title,
}: {
  youtube?: string | null;
  vimeo?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  title: string;
}) {
  const [active, setActive] = useState(false);

  const embedSrc = parseEmbed(youtube, vimeo);
  const directVideoUrl = videoUrl?.trim() || null;
  const hasPlayableSource = Boolean(embedSrc || directVideoUrl);

  if (active && embedSrc) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
        <iframe
          src={embedSrc}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (active && directVideoUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={thumbnail || undefined}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          aria-label={title}
        >
          <source
            src={directVideoUrl}
            type={getVideoType(directVideoUrl)}
          />

          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (hasPlayableSource) {
          setActive(true);
        }
      }}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-mist shadow-md shadow-ink/10 transition-shadow hover:shadow-lg hover:shadow-ink/20 disabled:cursor-default"
      disabled={!hasPlayableSource}
      aria-label={
        hasPlayableSource
          ? `Play ${title}`
          : `${title} has no video source`
      }
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground">
          {hasPlayableSource
            ? "Play video"
            : "No preview available"}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

      {hasPlayableSource && (
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/10 text-white backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-ink">
          <Play className="h-5 w-5 translate-x-[2px] fill-current" />
        </span>
      )}
    </button>
  );
}
