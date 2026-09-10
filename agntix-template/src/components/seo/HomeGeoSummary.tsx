import { getTranslations } from "next-intl/server";
import { GeoAnswer } from "@/components/seo/GeoAnswer";

export async function HomeGeoSummary() {
  const t = await getTranslations("geo");
  return <GeoAnswer>{t("home")}</GeoAnswer>;
}
