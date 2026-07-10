import Link from 'next/link';
import { getAllCategories } from '@/data/config';

const CATEGORIES = getAllCategories();

export default function ChatHelpPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-heading text-2xl font-bold text-content-primary">
          Crossword Help
        </h1>
        <p className="text-sm leading-relaxed text-content-primary/60">
          Stuck on a clue? Here are some tips:
        </p>

        <ul className="space-y-2 text-left text-sm text-content-primary/70">
          <li>
            <strong className="text-content-primary">Look at intersecting words</strong>
            &mdash; letters from completed words can reveal the answer.
          </li>
          <li>
            <strong className="text-content-primary">Think about the category</strong>
            &mdash; clues are grouped by {CATEGORIES.join(', ')}.
          </li>
          <li>
            <strong className="text-content-primary">Skip and return</strong>
            &mdash; you can answer questions in any order.
          </li>
          <li>
            <strong className="text-content-primary">Check the word length</strong>
            &mdash; the card shows the number of letters needed.
          </li>
        </ul>

        <Link
          href="/puzzle"
          className="mt-6 inline-block rounded-ui-element bg-brand-main px-6 py-2.5 text-sm font-semibold text-content-inverse transition-colors hover:bg-brand-hover"
        >
          Return to Puzzle
        </Link>
      </div>
    </div>
  );
}
