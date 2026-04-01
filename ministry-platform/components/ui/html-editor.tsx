'use client';

import { useRef, useCallback } from 'react';

const TOOLBAR = [
  { label: 'Bold', tag: 'strong', title: 'Bold' },
  { label: 'Italic', tag: 'em', title: 'Italic' },
  { label: 'Underline', tag: 'u', title: 'Underline' },
  { label: 'H2', tag: 'h2', title: 'Heading 2' },
  { label: 'H3', tag: 'h3', title: 'Heading 3' },
  { label: 'List', tag: 'ul', wrap: '<li></li>', title: 'Bullet list' },
  { label: 'Link', tag: 'a', attr: 'href', title: 'Insert link' },
  { label: 'Quote', tag: 'blockquote', title: 'Quote' },
];

export interface HtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

export function HtmlEditor({ value, onChange, placeholder = 'Write content...', minHeight = '200px', className = '', disabled }: HtmlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.slice(start, end);
    const newText = text.slice(0, start) + before + selected + after + text.slice(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, [onChange]);

  const handleToolbar = useCallback((item: typeof TOOLBAR[0]) => {
    if (item.attr === 'href') {
      const url = window.prompt('Enter URL:');
      if (url) insertAtCursor(`<a href="${url}">`, '</a>');
      return;
    }
    const wrap = item.wrap || '';
    const before = wrap ? `<${item.tag}>\n${wrap}` : `<${item.tag}>`;
    const after = wrap ? `\n</${item.tag}>` : `</${item.tag}>`;
    insertAtCursor(before, after);
  }, [insertAtCursor]);

  return (
    <div className={`border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {TOOLBAR.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.title}
            onClick={() => handleToolbar(item)}
            disabled={disabled}
            className="px-2.5 py-1.5 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-0 resize-y min-h-[120px]"
        style={{ minHeight }}
        spellCheck
      />
      <p className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        You can use HTML (e.g. &lt;p&gt;, &lt;strong&gt;, &lt;a href="..."&gt;). Use the toolbar above for quick formatting.
      </p>
    </div>
  );
}
