'use client';

interface ShareResultsProps {
  name: string;
  score: number;
  time: string;
  badges: number;
  correct: number;
  total: number;
}

export default function ShareResults({ name, score, time, badges, correct, total }: ShareResultsProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/share?name=${encodeURIComponent(name)}&score=${encodeURIComponent(score)}&time=${encodeURIComponent(time)}&badges=${encodeURIComponent(badges)}&correct=${encodeURIComponent(correct)}&total=${encodeURIComponent(total)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex w-full gap-4">
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-ui-element border border-white/20 bg-brand-main px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-brand-hover"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Share on Facebook
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-ui-element border border-white/20 bg-brand-hover px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-brand-main"
      >
        <span className="text-lg leading-none italic font-extrabold" aria-hidden="true">
          in
        </span>
        Share on LinkedIn
      </a>
    </div>
  );
}
