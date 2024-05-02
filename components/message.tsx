'use client'

import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { MemoizedReactMarkdown } from './ui/markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
// import { Provider as MathJaxProvider } from 'react-mathjax2';
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'




export function BotMessage({
  content
}: {
  content: string | StreamableValue<string>
}) {
  const [data, error, pending] = useStreamableValue(content)

  // Currently, sometimes error occurs after finishing the stream.
  if (error) return <div>Error</div>

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }], [rehypeKatex]]}
      remarkPlugins={[remarkGfm, remarkMath]}
      className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
    >
      {data}
    </MemoizedReactMarkdown>
  )
}
