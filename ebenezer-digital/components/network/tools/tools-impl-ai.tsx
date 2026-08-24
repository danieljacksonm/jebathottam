"use client";

import { useMemo, useState } from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";
import {
  CopyButton,
  Field,
  GhostBtn,
  Panel,
  PrimaryBtn,
  Result,
  Toolbar,
  downloadText,
} from "./tool-ui";

const ROLES = ["Expert copywriter", "Senior developer", "SEO strategist", "Product marketer", "Technical writer"];
const TONES = ["Professional", "Friendly", "Persuasive", "Concise", "Educational"];
const FORMATS = ["Bullet list", "Step-by-step", "Blog outline", "Email", "Social post"];

export function AiPromptGenerator({ slug }: { slug: string }) {
  const [goal, setGoal] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [audience, setAudience] = useState("");
  const [constraints, setConstraints] = useState("");
  const [out, setOut] = useState("");

  const generate = () => {
    const prompt = [
      `You are a ${role}.`,
      `Tone: ${tone}.`,
      `Output format: ${format}.`,
      audience.trim() ? `Audience: ${audience.trim()}.` : "",
      goal.trim() ? `Task: ${goal.trim()}` : "Task: Help me accomplish my goal clearly.",
      constraints.trim() ? `Constraints: ${constraints.trim()}` : "",
      "",
      "Requirements:",
      "- Be specific and actionable",
      "- Avoid fluff",
      "- Ask clarifying questions only if critical information is missing",
    ]
      .filter(Boolean)
      .join("\n");
    setOut(prompt);
    trackNetworkEvent("tool_complete", { tool: slug, action: "generate" });
  };

  return (
    <Panel>
      <Field label="Goal / task">
        <textarea className="nx-textarea" style={{ minHeight: 100 }} value={goal} onChange={(e) => setGoal(e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <Field label="Role">
          <select className="nx-select" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Tone">
          <select className="nx-select" value={tone} onChange={(e) => setTone(e.target.value)}>
            {TONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Format">
        <select className="nx-select" value={format} onChange={(e) => setFormat(e.target.value)}>
          {FORMATS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label="Audience (optional)">
        <input className="nx-input" value={audience} onChange={(e) => setAudience(e.target.value)} />
      </Field>
      <Field label="Constraints (optional)">
        <input className="nx-input" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={generate}>Generate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Field label="Prompt">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function PromptFormatter({ slug }: { slug: string }) {
  const [raw, setRaw] = useState("");
  const [out, setOut] = useState("");

  const format = () => {
    const lines = raw
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const body = lines.join("\n");
    const structured = [
      "## Context",
      body || "(add context)",
      "",
      "## Instructions",
      "1. Restate the goal in one sentence",
      "2. Produce the requested deliverable",
      "3. List assumptions at the end",
      "",
      "## Output rules",
      "- Prefer concrete examples over abstractions",
      "- Keep sections clearly labeled",
    ].join("\n");
    setOut(structured);
    trackNetworkEvent("tool_complete", { tool: slug, action: "format" });
  };

  return (
    <Panel>
      <Field label="Raw prompt / notes">
        <textarea className="nx-textarea" value={raw} onChange={(e) => setRaw(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={format}>Format</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Field label="Formatted prompt">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function AiTextHelper({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"rewrite" | "shorten" | "expand" | "simplify">("rewrite");
  const [out, setOut] = useState("");

  const run = () => {
    const t = text.trim();
    if (!t) {
      setOut("");
      return;
    }
    let result = "";
    if (mode === "shorten") {
      result = t
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s+/)
        .slice(0, Math.max(1, Math.ceil(t.split(/(?<=[.!?])\s+/).length / 2)))
        .join(" ");
    } else if (mode === "expand") {
      result = `${t}\n\nIn more detail: this point matters because it clarifies the intent, reduces ambiguity for the reader, and makes the next action obvious.`;
    } else if (mode === "simplify") {
      result = t
        .replace(/\butilize\b/gi, "use")
        .replace(/\bapproximately\b/gi, "about")
        .replace(/\bin order to\b/gi, "to")
        .replace(/\bdemonstrate\b/gi, "show");
    } else {
      result = t
        .replace(/\s+/g, " ")
        .replace(/\bi\b/g, "I")
        .trim();
      if (result && !/[.!?]$/.test(result)) result += ".";
    }
    const prompt = [
      `Mode: ${mode}`,
      "",
      "Original:",
      t,
      "",
      "Suggested local rewrite (offline helper — refine in your AI chat if needed):",
      result,
    ].join("\n");
    setOut(prompt);
    trackNetworkEvent("tool_complete", { tool: slug, action: mode });
  };

  return (
    <Panel>
      <Field label="Text">
        <textarea className="nx-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Field label="Mode">
        <select className="nx-select" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="rewrite">Rewrite clearly</option>
          <option value="shorten">Shorten</option>
          <option value="expand">Expand</option>
          <option value="simplify">Simplify wording</option>
        </select>
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run}>Generate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
      </Toolbar>
      <Field label="Result">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function AiContentOutline({ slug }: { slug: string }) {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [sections, setSections] = useState("6");
  const [out, setOut] = useState("");

  const generate = () => {
    const n = Math.min(12, Math.max(3, Number(sections) || 6));
    const t = topic.trim() || "Your topic";
    const aud = audience.trim() || "general readers";
    const heads = [
      `What is ${t}?`,
      `Why ${t} matters for ${aud}`,
      `Core concepts and definitions`,
      `Step-by-step practical guide`,
      `Common mistakes to avoid`,
      `Tools and examples`,
      `Best practices checklist`,
      `Advanced tips`,
      `FAQs`,
      `Conclusion and next steps`,
      `Resources`,
      `Summary`,
    ].slice(0, n);

    const outline = [
      `# Content outline: ${t}`,
      `Audience: ${aud}`,
      "",
      ...heads.map((h, i) => `## ${i + 1}. ${h}\n- Key point\n- Example\n- Takeaway`),
      "",
      "CTA: Invite the reader to take one clear next action.",
    ].join("\n");
    setOut(outline);
    trackNetworkEvent("tool_complete", { tool: slug, action: "generate" });
  };

  return (
    <Panel>
      <Field label="Topic">
        <input className="nx-input" value={topic} onChange={(e) => setTopic(e.target.value)} />
      </Field>
      <Field label="Audience">
        <input className="nx-input" value={audience} onChange={(e) => setAudience(e.target.value)} />
      </Field>
      <Field label="Sections (3–12)">
        <input className="nx-input" type="number" min={3} max={12} value={sections} onChange={(e) => setSections(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={generate}>Generate</PrimaryBtn>
        <CopyButton text={out} slug={slug} />
        <GhostBtn
          disabled={!out}
          onClick={() => {
            downloadText("outline.md", out, "text/markdown");
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="Outline">
        <textarea className="nx-textarea" value={out} readOnly />
      </Field>
    </Panel>
  );
}

export function AiSeoBrief({ slug }: { slug: string }) {
  const [keyword, setKeyword] = useState("");
  const [secondary, setSecondary] = useState("");
  const [intent, setIntent] = useState("Informational");
  const [out, setOut] = useState("");

  const brief = useMemo(() => {
    const kw = keyword.trim() || "primary keyword";
    const sec = secondary
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return [
      `# SEO content brief`,
      ``,
      `Primary keyword: ${kw}`,
      `Secondary keywords: ${sec.length ? sec.join(", ") : "(add related terms)"}`,
      `Search intent: ${intent}`,
      ``,
      `## Suggested title ideas`,
      `1. ${kw}: A Practical Guide`,
      `2. How to Master ${kw} (With Examples)`,
      `3. ${kw} Explained for Beginners`,
      ``,
      `## Meta description draft`,
      `Learn ${kw} with clear steps, examples, and tips. Built for ${intent.toLowerCase()} searchers who want actionable results.`,
      ``,
      `## Outline`,
      `1. Introduction — hook + promise`,
      `2. What ${kw} means`,
      `3. Why it matters`,
      `4. Step-by-step process`,
      `5. Examples / templates`,
      `6. Mistakes & fixes`,
      `7. FAQ`,
      `8. Conclusion + CTA`,
      ``,
      `## On-page checklist`,
      `- H1 includes primary keyword`,
      `- First 100 words introduce the topic`,
      `- Internal links to related pages`,
      `- Descriptive image alt text`,
      `- Unique meta title (~50–60 chars) and description (~140–160 chars)`,
    ].join("\n");
  }, [keyword, secondary, intent]);

  return (
    <Panel>
      <Field label="Primary keyword">
        <input className="nx-input" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </Field>
      <Field label="Secondary keywords (comma-separated)">
        <input className="nx-input" value={secondary} onChange={(e) => setSecondary(e.target.value)} />
      </Field>
      <Field label="Search intent">
        <select className="nx-select" value={intent} onChange={(e) => setIntent(e.target.value)}>
          {["Informational", "Commercial", "Transactional", "Navigational"].map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </Field>
      <Toolbar>
        <PrimaryBtn
          onClick={() => {
            setOut(brief);
            trackNetworkEvent("tool_complete", { tool: slug, action: "generate" });
          }}
        >
          Generate
        </PrimaryBtn>
        <CopyButton text={out || brief} slug={slug} />
        <GhostBtn
          onClick={() => {
            const t = out || brief;
            downloadText("seo-brief.md", t, "text/markdown");
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <Field label="Brief">
        <textarea className="nx-textarea" value={out || brief} readOnly />
      </Field>
      {!out ? <Result>Click Generate to lock analytics; preview updates live.</Result> : null}
    </Panel>
  );
}
