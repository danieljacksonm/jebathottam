import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
