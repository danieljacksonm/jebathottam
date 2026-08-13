"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Download, Maximize2 } from "lucide-react";

function CodeBlock({
  language,
  children,
  onOpen,
}: {
  language: string;
  children: string;
  onOpen?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  const download = () => {
    const blob = new Blob([children], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artifact.${language || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-code">
      <div className="ai-code-bar">
        <span>{language || "code"}</span>
        <div className="ai-code-actions">
          {onOpen && (
            <button type="button" onClick={onOpen} aria-label="Expand artifact">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button type="button" onClick={download} aria-label="Download">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => void copy()} aria-label="Copy code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function AiMarkdown({
  content,
  onOpenArtifact,
}: {
  content: string;
  onOpenArtifact?: (code: string, language: string) => void;
}) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className="ai-prose">
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
            {children}
          </a>
        ),
        code: ({ className, children, ...props }) => {
          const text = String(children).replace(/\n$/, "");
          const match = /language-([a-zA-Z0-9_-]+)/.exec(className || "");
          const inline = !match && !text.includes("\n");
          if (inline) {
            return (
              <code className="ai-inline-code" {...props}>
                {text}
              </code>
            );
          }
          const language = match?.[1] || "text";
          return (
            <CodeBlock
              language={language}
              onOpen={
                onOpenArtifact ? () => onOpenArtifact(text, language) : undefined
              }
            >
              {text}
            </CodeBlock>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
