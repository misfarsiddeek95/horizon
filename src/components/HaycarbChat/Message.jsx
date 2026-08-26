'use client';

import ReactMarkdown from 'react-markdown';
import ChartBlock from './ChartBlock';
import ImageStrip from './ImageStrip';
import MessageActions from './MessageActions';

/**
 * One message bubble. User messages are plain text;
 * assistant messages may carry markdown, charts and person photos.
 */
export default function Message({ message, onCanvasReady, onExport, exportingId }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex w-full max-w-[820px] gap-2.5 ${
        isUser ? 'flex-row-reverse self-end' : 'self-start'
      }`}
      data-message-id={message.id}
    >
      <Avatar isUser={isUser} />

      <div
        className={`max-w-[calc(100%-40px)] rounded-2xl border px-4 py-3 font-sans text-[13.5px] leading-relaxed text-white ${
          isUser
            ? 'rounded-br-md border-brand-main/30 bg-brand-main/20 backdrop-blur-md'
            : 'rounded-bl-md border-white/20 bg-white/10 shadow-sm backdrop-blur-md'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <div className="hc-markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            <ImageStrip images={message.images} />

            {message.charts?.map((chart, i) => (
              <ChartBlock
                key={i}
                chart={chart}
                onCanvasReady={canvas => onCanvasReady?.(message.id, i, canvas)}
              />
            ))}

            <MessageActions
              message={message}
              onExport={() => onExport?.(message)}
              exporting={exportingId === message.id}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Avatar({ isUser }) {
  return (
    <div
      className={`mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-ui-element text-[11px] font-bold tracking-wide ${
        isUser
          ? 'bg-white/15 text-white'
          : 'border border-white/20 bg-gradient-to-br from-brand-main to-brand-hover text-white'
      }`}
    >
      {isUser ? 'YOU' : 'AI'}
    </div>
  );
}
