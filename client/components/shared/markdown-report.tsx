import { Fragment } from "react";

// Lightweight, dependency-free renderer for the free-text Gemini output
// (feedbackReport, experienceQualityReport). Renders headings, bullet lists,
// and **bold** spans as real React elements (no dangerouslySetInnerHTML), so
// there's no HTML-injection surface even though this is AI-generated text.
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

export function MarkdownReport({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item, `${key}-li-${i}`)}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    const key = `block-${idx}`;

    if (!line) {
      flushList(key);
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      listBuffer.push(bulletMatch[1]);
      return;
    }
    flushList(key);

    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const className =
        level === 1
          ? "text-base font-semibold text-foreground"
          : level === 2
            ? "text-sm font-semibold text-foreground"
            : "text-sm font-medium text-foreground";
      blocks.push(
        <p key={key} className={className}>
          {renderInline(text, key)}
        </p>,
      );
      return;
    }

    blocks.push(
      <p key={key} className="text-sm leading-relaxed text-muted-foreground">
        {renderInline(line, key)}
      </p>,
    );
  });

  flushList("tail");

  return <div className="space-y-2.5">{blocks}</div>;
}
