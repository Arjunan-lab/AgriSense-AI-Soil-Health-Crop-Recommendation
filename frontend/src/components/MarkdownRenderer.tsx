import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`markdown-content space-y-2 text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-inherit" {...props} />
          ),
          // Links
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600 transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          // Paragraphs
          p: ({ node, children, ...props }) => (
            <p className="mb-2 last:mb-0 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          // Unordered Lists
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-2 pl-2" {...props}>
              {children}
            </ul>
          ),
          // Ordered Lists
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 pl-2" {...props}>
              {children}
            </ol>
          ),
          // List Items
          li: ({ node, children, ...props }) => (
            <li className="leading-normal" {...props}>
              {children}
            </li>
          ),
          // Code Blocks and Inline Code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="my-3 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md">
                {match && (
                  <div className="bg-gray-800/80 px-3 py-1 text-[11px] font-mono text-gray-400 border-b border-gray-700/50 flex justify-between items-center">
                    <span>{match[1]}</span>
                  </div>
                )}
                <pre className="p-3 text-xs font-mono text-green-400 overflow-x-auto leading-relaxed">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Tables
          table: ({ node, children, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-border shadow-soft">
              <table className="min-w-full divide-y divide-border text-xs" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-surface-secondary/60 font-semibold text-text-primary" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ node, children, ...props }) => (
            <tbody className="divide-y divide-border/60 bg-surface/40" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="hover:bg-black/5 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ node, children, ...props }) => (
            <th className="px-3 py-2 text-left font-bold text-text-primary uppercase tracking-wider text-[11px]" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-3 py-2 text-text-secondary whitespace-nowrap" {...props}>
              {children}
            </td>
          ),
          // Images
          img: ({ node, src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || 'Chatbot media'}
              className="max-w-full rounded-xl my-2 border border-border shadow-soft object-cover"
              loading="lazy"
              {...props}
            />
          ),
          // Headers
          h1: ({ node, children, ...props }) => (
            <h1 className="text-base font-bold my-2 text-text-primary" {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-sm font-bold my-2 text-text-primary" {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-xs font-bold my-1.5 text-text-primary" {...props}>
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
