import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import Contact from "./sections/Contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Ebenezer Digital Services | Reliable Digital & Web Services for Your Business",
  description:
    "Professional web development, e-commerce, automation, and digital support. Trusted by clients worldwide — clear communication, on-time delivery.",
  path: "/",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070708]">
      <Hero />
      <Services />
      <Portfolio />
      <Contact />
    </main>
  );
}
