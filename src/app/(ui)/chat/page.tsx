'use client';

import HaycarbChat from '@/components/HaycarbChat';
import HaycarbDocSearch from '@/components/HaycarbDocSearch';
import { mergeAndDownloadPdfs } from '@/utils/mergePdfs';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-surface-default">
      <section className="h-[80vh] border-b border-black/10">
        <HaycarbChat />
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <HaycarbDocSearch onDownload={mergeAndDownloadPdfs} />
      </section>
    </main>
  );
}
