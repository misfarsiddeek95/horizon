import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";

interface DownloadButtonV2Props {
  download: DownloadLink;
}

export default function DownloadButtonV2({ download }: DownloadButtonV2Props) {
  return (
    <a
      href={download.pdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${download.label}`}
      className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-brand-main hover:bg-brand-main hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-offset-2"
    >
      <span>{download.label}</span>
      <ArrowDownTrayIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
}
