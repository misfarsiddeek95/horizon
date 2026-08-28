import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import type { DownloadLink } from "@/data/userProfiles";

interface DownloadButtonV2Props {
  download: DownloadLink;
}

export default function DownloadButtonV2({ download }: DownloadButtonV2Props) {
  return (
    <Button
      behavior="link"
      href={download.pdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${download.label}`}
      variant="secondary"
      radius="full"
      icon={<ArrowDownTrayIcon />}
      iconPosition="right"
    >
      {download.label}
    </Button>
  );
}
