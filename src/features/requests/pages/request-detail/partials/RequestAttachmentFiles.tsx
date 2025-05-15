import { Card } from "../../../../../components/ui/card.tsx";
import AttachmentConfigurationPresentation, { FileAttachment } from "../../../../../common/components/AttachmentConfiguration/AttachmentConfigurationPresentation.tsx";

interface RequestAttachmentFilesProps {
  attachments: FileAttachment[];
  onDownload: (file: any) => void;
}

const RequestAttachmentFiles = ({ attachments, onDownload }: RequestAttachmentFilesProps) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg md:text-xl">Anexos da solicitação:</p>
      <Card
        className="border-primary bg-[var(--system-card)] p-5 transition-all border rounded-[var(--card-border-radius)]">
        <AttachmentConfigurationPresentation
          attachments={attachments}
          direction="column"
          onDownload={onDownload}
        />
      </Card>
    </div>
  );
};

export default RequestAttachmentFiles;
