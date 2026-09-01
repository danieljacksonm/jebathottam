import { LOCAL_SCENES } from "@/lib/media";

export const BRAND_VIDEO_POSTER = "/images/kodai/hero.webp";

/** Optional hosted video — YouTube, Vimeo, MP4/WebM URL, or Facebook video link. */
export const BRAND_VIDEO_URL = process.env.NEXT_PUBLIC_BRAND_VIDEO_URL?.trim() || "";

export const BRAND_FILM_SCENES = Object.values(LOCAL_SCENES);

export type BrandVideoEmbed =
  | { kind: "youtube"; src: string }
  | { kind: "vimeo"; src: string }
  | { kind: "facebook"; src: string }
  | { kind: "file"; src: string };

export function resolveBrandVideoEmbed(url: string): BrandVideoEmbed | null {
  if (!url) return null;

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { kind: "file", src: url };
  }

  const youtube =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1] ||
    url.match(/youtube\.com\/embed\/([\w-]{11})/)?.[1];
  if (youtube) {
    return {
      kind: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  if (vimeo) {
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${vimeo}?autoplay=1` };
  }

  if (url.includes("facebook.com")) {
    const encoded = encodeURIComponent(url);
    return {
      kind: "facebook",
      src: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=true`,
    };
  }

  return null;
}

export function getBrandVideoEmbed(): BrandVideoEmbed | null {
  return resolveBrandVideoEmbed(BRAND_VIDEO_URL);
}
