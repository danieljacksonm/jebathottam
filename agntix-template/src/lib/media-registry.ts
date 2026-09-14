/** Path → alt text for Darjeeling package and destination imagery. */
export const DARJEELING_MEDIA: Record<string, { src: string; alt: string }> = {
  hero: {
    src: "/images/darjeeling/hero/darjeeling-hero.jpg",
    alt: "Darjeeling hills under open sky — destination hero",
  },
  "mimbusty-1": {
    src: "/images/darjeeling/mimbusty/mimbusty-1.jpg",
    alt: "Mimbusty stay area with mountain outlook toward Kanchenjunga",
  },
  "mimbusty-2": {
    src: "/images/darjeeling/mimbusty/mimbusty-2.jpg",
    alt: "Mimbusty hillside scenery on the Darjeeling circuit",
  },
  "mimbusty-3": {
    src: "/images/darjeeling/mimbusty/mimbusty-3.jpg",
    alt: "Views near Mimbusty homestay in the Darjeeling hills",
  },
  "mimbusty-4": {
    src: "/images/darjeeling/mimbusty/mimbusty-4.jpg",
    alt: "Pine and ridge landscape around Mimbusty",
  },
  "mimbusty-5": {
    src: "/images/darjeeling/mimbusty/mimbusty-5.jpg",
    alt: "Evening light over Mimbusty stay surroundings",
  },
  "mimbusty-6": {
    src: "/images/darjeeling/mimbusty/mimbusty-6.jpg",
    alt: "Mimbusty valley and ridgeline vistas",
  },
  "tabakoshi-1": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-1.jpg",
    alt: "Tabakoshi mountain riverside stay setting",
  },
  "tabakoshi-2": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-2.jpg",
    alt: "River and hills near Tabakoshi on the Darjeeling circuit",
  },
  "tabakoshi-3": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-3.jpg",
    alt: "Tabakoshi riverside landscape",
  },
  "tabakoshi-4": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-4.jpg",
    alt: "Forest and stream scenery around Tabakoshi",
  },
  "tabakoshi-5": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-5.jpg",
    alt: "Tabakoshi valley views from the stay area",
  },
  "tabakoshi-6": {
    src: "/images/darjeeling/tabakoshi/tabakoshi-6.jpg",
    alt: "Quiet mountain riverside at Tabakoshi",
  },
  "dawaipani-1": {
    src: "/images/darjeeling/dawaipani/dawaipani-1.jpg",
    alt: "Dawaipani viewpoint and tea-garden hills",
  },
  "dawaipani-2": {
    src: "/images/darjeeling/dawaipani/dawaipani-2.jpg",
    alt: "Scenic stop near Dawaipani on Day 1",
  },
  "dawaipani-3": {
    src: "/images/darjeeling/dawaipani/dawaipani-3.jpg",
    alt: "Pine forest and ridges around Dawaipani",
  },
  "dawaipani-4": {
    src: "/images/darjeeling/dawaipani/dawaipani-4.jpg",
    alt: "Dawaipani countryside overlook",
  },
  "dawaipani-5": {
    src: "/images/darjeeling/dawaipani/dawaipani-5.jpg",
    alt: "Tea slopes and mist near Dawaipani",
  },
  "dawaipani-6": {
    src: "/images/darjeeling/dawaipani/dawaipani-6.jpg",
    alt: "Homestay surroundings at Dawaipani",
  },
  "town-1": {
    src: "/images/darjeeling/darjeeling-town/town-1.jpg",
    alt: "Darjeeling town street and hillside buildings",
  },
  "town-2": {
    src: "/images/darjeeling/darjeeling-town/town-2.jpg",
    alt: "Darjeeling Mall Road and local market atmosphere",
  },
  "town-3": {
    src: "/images/darjeeling/darjeeling-town/town-3.jpg",
    alt: "Classic Darjeeling townscape",
  },
  "town-4": {
    src: "/images/darjeeling/darjeeling-town/town-4.jpg",
    alt: "Darjeeling hill town rooftops and lanes",
  },
  "town-5": {
    src: "/images/darjeeling/darjeeling-town/town-5.jpg",
    alt: "Busy Darjeeling street scene",
  },
  "town-6": {
    src: "/images/darjeeling/darjeeling-town/town-6.jpg",
    alt: "Darjeeling town with mountain backdrop",
  },
  "banner-1": {
    src: "/images/darjeeling/banners/banner-1.jpg",
    alt: "Darjeeling travel banner — Himalayan hills",
  },
  "banner-2": {
    src: "/images/darjeeling/banners/banner-2.jpg",
    alt: "Darjeeling travel banner — tea garden slopes",
  },
  "banner-3": {
    src: "/images/darjeeling/banners/banner-3.jpg",
    alt: "Darjeeling travel banner — misty ridge",
  },
  "banner-4": {
    src: "/images/darjeeling/banners/banner-4.jpg",
    alt: "Darjeeling travel banner — pine forest road",
  },
  "banner-5": {
    src: "/images/darjeeling/banners/banner-5.jpg",
    alt: "Darjeeling travel banner — valley outlook",
  },
  g1: {
    src: "/images/darjeeling/gallery/g1.jpg",
    alt: "Darjeeling gallery — scenic hill view",
  },
  g2: {
    src: "/images/darjeeling/gallery/g2.jpg",
    alt: "Darjeeling gallery — tea estate landscape",
  },
  g3: {
    src: "/images/darjeeling/gallery/g3.jpg",
    alt: "Darjeeling gallery — mountain panorama",
  },
  g4: {
    src: "/images/darjeeling/gallery/g4.jpg",
    alt: "Darjeeling gallery — forest trail",
  },
  g5: {
    src: "/images/darjeeling/gallery/g5.jpg",
    alt: "Darjeeling gallery — lakeside Mirik mood",
  },
};

/** Lookup alt text by public image path. */
export function darjeelingAltForPath(path: string): string | undefined {
  const entry = Object.values(DARJEELING_MEDIA).find((m) => m.src === path);
  return entry?.alt;
}

export const DARJEELING_PATH_ALT: Record<string, string> = Object.fromEntries(
  Object.values(DARJEELING_MEDIA).map((m) => [m.src, m.alt]),
);
