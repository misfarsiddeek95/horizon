'use client';

import HaycarbChat from '@/components/HaycarbChat';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-surface-default">
      <section className="h-[80vh] border-b border-black/10">
        <HaycarbChat />
      </section>
    </main>
  );
}
