import { Suspense } from "react";
import { AiStudio } from "./studio/AiStudio";

export default function AiPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="ai-os is-land grid min-h-screen place-items-center">
            Opening Ebenezer AI…
          </div>
        }
      >
        <AiStudio />
      </Suspense>

      <section className="sr-only">
        <h1>Ask anything with Ebenezer AI</h1>
        <p>
          An intelligent space for thinking, creating and discovering. Hosted by
          Ebenezer Digital on our own open-source model.
        </p>
        <h2>Ask</h2>
        <p>Write a question. Plan a trip. Draft a message. Think out loud.</p>
        <h2>Create</h2>
        <p>Shape outlines, websites, and writing without leaving the conversation.</p>
        <h2>Analyze</h2>
        <p>Drop a document or describe a problem. The assistant stays with the work.</p>
        <h2>Discover</h2>
        <p>Explore world news, store products, and billing help from the same calm space.</p>
      </section>
    </>
  );
}
