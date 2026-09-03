'use client';

import ReactMarkdown from 'react-markdown';
import { UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
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
        className={`max-w-[calc(100%-40px)] rounded-2xl border px-4 py-3 font-sans text-[13.5px] font-medium leading-relaxed text-white drop-shadow-md ${
          isUser
            ? 'rounded-br-md border-brand-main/30 bg-brand-main/30 backdrop-blur-md'
            : 'rounded-bl-md border-white/20 bg-[#020b10]/75 shadow-sm backdrop-blur-md'
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
  if (isUser) {
    return (
      <div className="mt-0.5 relative h-[32px] w-[32px] shrink-0">
        <div
          className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.3)]"
          style={{ background: 'linear-gradient(135deg, var(--color-tm-teal-blue), #147385, var(--color-tm-teal-blue))' }}
        />
        <div
          className="absolute inset-[2px] rounded-full flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-teal-2), var(--color-brand-main))' }}
        >
          <UserIcon className="h-3.5 w-3.5 text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0.5 relative h-[32px] w-[32px] shrink-0">
      <div
        className="absolute inset-[-3px] rounded-full blur-[4px] opacity-50 animate-[aiGlow_3s_ease-in-out_infinite]"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-tm-cyan-teal), var(--color-chart-teal))' }}
      />
      <div
        className="absolute inset-[-2px] rounded-full shadow-[0_0_10px_var(--color-brand-main),0_0_18px_var(--color-tm-cyan-teal)]"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-main), var(--color-tm-cyan-teal), var(--color-chart-teal))' }}
      />
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-hover), var(--color-brand-main))' }}
      >
        <SparklesIcon className="h-4 w-4 text-white drop-shadow-[0_0_4px_var(--color-tm-cyan-teal)]" />
      </div>
    </div>
  );
}
