import Image from "next/image";
import type { WorkMedia } from "@/db/schema";

// Aspect-ratio-safe media wrapper. width/height always come from the stored
// asset, so the browser reserves space before load — CLS budget stays 0.

type Props = {
  media: WorkMedia;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function MediaFrame({ media, priority = false, className = "", sizes = "100vw" }: Props) {
  if (media.kind === "video") {
    const src =
      media.provider === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${media.url}`
        : media.provider === "vimeo"
          ? `https://player.vimeo.com/video/${media.url}`
          : media.url;
    return (
      <div className={`relative overflow-hidden rounded-panel bg-paper-alt ${className}`}>
        <div className="aspect-video">
          <iframe
            src={src}
            title={media.alt}
            loading="lazy"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-panel bg-paper-alt ${className}`}>
      <Image
        src={media.url}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full object-cover"
      />
      {media.caption && (
        <figcaption className="px-4 py-3 text-meta text-ink/55">{media.caption}</figcaption>
      )}
    </figure>
  );
}
