"use client";

import { NetworkErrorBoundary } from "@/components/network/NetworkErrorBoundary";
import type { ComponentType } from "react";
import { Panel, Result } from "./tool-ui";
import {
  Base64Encoder,
  ColorConverter,
  CssFormatter,
  HashGenerator,
  HtmlFormatter,
  JavascriptFormatter,
  JsonFormatter,
  JsonValidator,
  JwtDecoder,
  MarkdownPreview,
  RegexTester,
  TimestampConverter,
  UrlEncoder,
  UuidGenerator,
} from "./tools-impl-dev";
import {
  CanonicalUrlGenerator,
  CaseConverter,
  DuplicateLineRemover,
  KeywordDensity,
  LoremIpsum,
  MetaTagGenerator,
  OpenGraphGenerator,
  RobotsTxtGenerator,
  SitemapGenerator,
  SlugGenerator,
  TextCleaner,
  WordCounter,
} from "./tools-impl-seo-text";
import {
  AgeCalculator,
  DiscountCalculator,
  EmiCalculator,
  GstCalculator,
  InvoiceCalculator,
  LoanCalculator,
  PercentageCalculator,
  ProfitMarginCalculator,
  TimeCalculator,
  UnitConverter,
} from "./tools-impl-calc";
import {
  ImageCompressor,
  ImageConverter,
  ImageResizer,
  QrCodeGenerator,
} from "./tools-impl-image";
import {
  AiContentOutline,
  AiPromptGenerator,
  AiSeoBrief,
  AiTextHelper,
  PromptFormatter,
} from "./tools-impl-ai";

type ToolProps = { slug: string };

const TOOL_MAP: Record<string, ComponentType<ToolProps>> = {
  "json-formatter": JsonFormatter,
  "json-validator": JsonValidator,
  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "uuid-generator": UuidGenerator,
  "jwt-decoder": JwtDecoder,
  "regex-tester": RegexTester,
  "hash-generator": HashGenerator,
  "timestamp-converter": TimestampConverter,
  "color-converter": ColorConverter,
  "markdown-preview": MarkdownPreview,
  "html-formatter": HtmlFormatter,
  "css-formatter": CssFormatter,
  "javascript-formatter": JavascriptFormatter,
  "meta-tag-generator": MetaTagGenerator,
  "robots-txt-generator": RobotsTxtGenerator,
  "sitemap-generator": SitemapGenerator,
  "slug-generator": SlugGenerator,
  "open-graph-generator": OpenGraphGenerator,
  "canonical-url-generator": CanonicalUrlGenerator,
  "keyword-density": KeywordDensity,
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  "text-cleaner": TextCleaner,
  "lorem-ipsum": LoremIpsum,
  "duplicate-line-remover": DuplicateLineRemover,
  "percentage-calculator": PercentageCalculator,
  "gst-calculator": GstCalculator,
  "emi-calculator": EmiCalculator,
  "discount-calculator": DiscountCalculator,
  "age-calculator": AgeCalculator,
  "loan-calculator": LoanCalculator,
  "time-calculator": TimeCalculator,
  "unit-converter": UnitConverter,
  "invoice-calculator": InvoiceCalculator,
  "profit-margin-calculator": ProfitMarginCalculator,
  "qr-code-generator": QrCodeGenerator,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "image-converter": ImageConverter,
  "ai-prompt-generator": AiPromptGenerator,
  "prompt-formatter": PromptFormatter,
  "ai-text-helper": AiTextHelper,
  "ai-content-outline": AiContentOutline,
  "ai-seo-brief": AiSeoBrief,
};

export function ToolWorkspace({ slug }: { slug: string }) {
  const Tool = TOOL_MAP[slug];
  if (!Tool) {
    return (
      <Panel>
        <Result>This tool isn&apos;t available yet. Try browsing the tools directory.</Result>
      </Panel>
    );
  }
  return (
    <NetworkErrorBoundary>
      <div className="nx-workspace">
        <Tool slug={slug} />
      </div>
    </NetworkErrorBoundary>
  );
}
