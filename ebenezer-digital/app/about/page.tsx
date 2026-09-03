import { permanentRedirect } from "next/navigation";

/** Canonical “About” entry — content lives on /why to avoid empty SEO shells. */
export default function AboutRedirect() {
  permanentRedirect("/why");
}
