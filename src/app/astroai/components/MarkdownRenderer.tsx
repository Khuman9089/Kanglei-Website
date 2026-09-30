'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export function MarkdownRenderer({ content, isUser = false }: MarkdownRendererProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Split into lines and render structured markdown
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-2 pl-4 list-disc text-slate-700 text-xs">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*)/);
    return tokens.map((tok, idx) => {
      if (tok.startsWith('**') && tok.endsWith('**')) {
        return (
          <strong key={idx} className="font-extrabold text-slate-900">
            {tok.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{tok}</span>;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`flush-${idx}`);
      return;
    }

    // H3 / H2 / H1
    if (trimmed.startsWith('### ')) {
      flushList(`h3-${idx}`);
      elements.push(
        <h4 key={`h3-${idx}`} className="text-xs font-black text-indigo-900 uppercase tracking-wide mt-3 mb-1.5 flex items-center gap-1.5">
          {trimmed.slice(4)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList(`h2-${idx}`);
      const title = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h3 key={`h2-${idx}`} className="text-sm font-black text-slate-900 mt-3 mb-1.5">
          {title}
        </h3>
      );
      return;
    }

    // Callout box / Key Takeaway
    if (trimmed.startsWith('💡') || trimmed.startsWith('✨') || trimmed.toLowerCase().includes('key takeaway') || trimmed.toLowerCase().includes('practical advice')) {
      flushList(`callout-${idx}`);
      elements.push(
        <div
          key={`callout-${idx}`}
          className="my-2.5 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs shadow-xs"
        >
          {formatInline(trimmed)}
        </div>
      );
      return;
    }

    // Bullet points (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const bulletContent = trimmed.slice(2);
      listItems.push(
        <li key={`li-${idx}`} className="leading-relaxed">
          {formatInline(bulletContent)}
        </li>
      );
      return;
    }

    // Regular paragraph line
    flushList(`p-${idx}`);
    elements.push(
      <p key={`p-${idx}`} className="text-xs text-slate-700 leading-relaxed my-1">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList('final-list');

  return <div className="space-y-1 text-xs">{elements}</div>;
}
