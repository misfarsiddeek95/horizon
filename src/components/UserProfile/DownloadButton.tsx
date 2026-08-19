import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { DownloadLink } from "@/data/userProfiles";

interface DownloadButtonProps {
  download: DownloadLink;
}

export default function DownloadButton({ download }: DownloadButtonProps) {
  return (
    <a
      href={download.pdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${download.label}`}
      className="group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-main shadow-sm backdrop-blur-md transition-all duration-300 hover:border-brand-main hover:bg-brand-main hover:text-white hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-main focus-visible:ring-offset-2"
    >
      <span>{download.label}</span>
      <ArrowDownTrayIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
}
