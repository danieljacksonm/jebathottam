import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="studio-kicker">Contact</p>
          <h1 className="studio-display mt-4 text-5xl sm:text-7xl">
            LET’S BUILD
            <br />
            SOMETHING
            <br />
            EXCEPTIONAL.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--st-muted)]">
            Send a message with your requirements and we will get back to you as soon as possible.
          </p>
          <div className="mt-10 space-y-5 text-sm">
            <p>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Email</span>
              <a href="mailto:contact@ebenezerdigitalservices.com" className="text-white">
                contact@ebenezerdigitalservices.com
              </a>
            </p>
            <p>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">PayPal (custom work)</span>
              <span className="text-white/70">
                For paid client projects we can invoice through PayPal — cards and PayPal worldwide, in USD.
              </span>
            </p>
          </div>
        </div>
        <div className="border border-[var(--st-line)] bg-black/30 p-6 sm:p-8">
          <h2 className="font-serif text-3xl">Tell us about it.</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
