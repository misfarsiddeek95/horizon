import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import type { DownloadLink } from "@/data/userProfiles";

interface DownloadButtonProps {
  download: DownloadLink;
}

export default function DownloadButton({ download }: DownloadButtonProps) {
  return (
    <Button
      behavior="link"
      href={download.pdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${download.label}`}
      variant="primary"
      radius="full"
      icon={<ArrowDownTrayIcon />}
      iconPosition="right"
    >
      {download.label}
    </Button>
  );
}
