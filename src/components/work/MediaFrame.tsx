import Image from "next/image";
import { Play } from "lucide-react";
import type { WorkMedia } from "@/db/schema";

// Aspect-ratio-safe media wrapper. width/height always come from the stored
// asset, so the browser reserves space before load — CLS budget stays 0.

type Props = {
  media: WorkMedia;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** false = render an inert preview instead of a live iframe. Iframes
   *  swallow clicks (they don't bubble to an ancestor <button> in the parent
   *  document), so grid tiles that need a click-anywhere-to-open affordance
   *  must opt out of the live embed. Defaults to true (lightbox/full view). */
  interactive?: boolean;
};

export function MediaFrame({
  media,
  priority = false,
  className = "",
  sizes = "100vw",
  interactive = true,
}: Props) {
  // NOTE — the video branch below is currently UNREACHABLE from the admin.
  // MediaUploader hardcodes kind:"image" and WorkForm has no embed field, so
  // no stored WorkMedia can have kind:"video" today. The branch is kept
  // deliberately as the rendering contract for a follow-up that adds a video
  // embed field to the work admin (CSP frame-src already allows
  // youtube-nocookie + player.vimeo, see next.config.ts). Don't delete it as
  // dead code; don't assume it's been exercised in production either.
  if (media.kind === "video") {
    if (!interactive) {
      // Grid-tile preview: no live embed (so the wrapping <button> always
      // receives the click), just the poster art + a play affordance.
      return (
        <div className={`relative overflow-hidden rounded-panel bg-paper-alt ${className}`}>
          {media.poster ? (
            <Image
              src={media.poster}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes={sizes}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="aspect-video" />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink/70 text-paper">
              <Play className="ml-0.5 h-5 w-5" aria-hidden fill="currentColor" />
            </span>
          </div>
        </div>
      );
    }

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
