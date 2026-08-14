import Hero from "./sections/Hero";
import Services from "./sections/Services";
import StudioWorld from "./studio/StudioWorld";
import Portfolio from "./sections/Portfolio";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";

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
