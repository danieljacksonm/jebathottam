import filmTable from "../../content/db/film.json";
import {
  pickLocalized,
  type LocalizedString,
  type LocalizedStringList,
} from "@/lib/content/types";

export type FilmSceneTone =
  | "gold"
  | "mist"
  | "forest"
  | "lake"
  | "night"
  | "falls";

export type FilmSceneRow = {
  id: string;
  place: LocalizedString;
  quote: LocalizedString;
  note?: LocalizedString;
  image: string;
  tone: FilmSceneTone;
};

type FilmTable = {
  table: string;
  version: number;
  scenes: FilmSceneRow[];
  placeRibbon: LocalizedStringList;
};

const table = filmTable as FilmTable;

export const filmSceneRows = table.scenes;

export type FilmScene = {
  id: string;
  place: string;
  quote: string;
  note?: string;
  image: string;
  tone: FilmSceneTone;
};

export function getLocalizedFilmScenes(locale: string): FilmScene[] {
  return filmSceneRows.map((scene) => ({
    id: scene.id,
    place: pickLocalized(scene.place, locale),
    quote: pickLocalized(scene.quote, locale),
    note: scene.note ? pickLocalized(scene.note, locale) : undefined,
    image: scene.image,
    tone: scene.tone,
  }));
}

export function getLocalizedPlaceRibbon(locale: string): string[] {
  return pickLocalized(table.placeRibbon, locale);
}

/** English fallback for any static imports */
export const filmScenes: FilmScene[] = getLocalizedFilmScenes("en");
export const placeRibbon: string[] = getLocalizedPlaceRibbon("en");
