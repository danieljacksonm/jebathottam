import Hero from "./sections/Hero";
import Services from "./sections/Services";
import StudioWorld from "./studio/StudioWorld";
import Portfolio from "./sections/Portfolio";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Ebenezer Digital Services | Reliable Digital & Web Services for Your Business",
  description:
    "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide. Clear communication, on-time delivery, affordable rates.",
  path: "/",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070708]">
      <Hero />
      <Services />
      <StudioWorld />
      <Portfolio />
      <Testimonials />
      <Contact />
    </main>
  );
}
