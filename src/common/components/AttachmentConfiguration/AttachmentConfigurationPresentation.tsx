import { FC, useState } from "react";
import { Download } from "lucide-react";
import { FileIcon } from "../FileIcon";
import { cn } from "../../../config/lib/utils";

export interface FileAttachment {
  key: string;
  files: File[] | any[];
  fileName: string;
}

interface AttachmentConfigurationPresentationProps {
  attachments: FileAttachment[];
  direction?: "row" | "column";
  onDownload?: (file: File, attachmentKey: string) => void;
  className?: string;
  collapsible?: boolean;
}

export const AttachmentConfigurationPresentation: FC<AttachmentConfigurationPresentationProps> = ({
  attachments,
  direction = "column",
  onDownload,
  className,
  collapsible = false
}) => {
  const [expanded, setExpanded] = useState(false);

  if(!attachments || attachments.length === 0) {
    return <p className="text-gray-500">Nenhum anexo fornecido.</p>;
  }

  console.log(attachments)

  return (
    <div className={cn("space-y-4", className)}>
      {attachments.map((attachment) => {
        const hasExcessFiles = collapsible && attachment.files.length > 3;
        const displayFiles = hasExcessFiles && !expanded ? attachment.files.slice(0, 3) : attachment.files;

        return (
          <div key={attachment.key} className="border rounded-md p-4">
            <h5 className="font-medium mb-2">{attachment.fileName}:</h5>
            <div
              className={cn(
                "grid gap-2",
                direction === "column"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {displayFiles.map((file, index) => (
                <div
                  key={`${attachment.key}-${index}`}
                  className="flex items-center justify-between gap-2 bg-secondary rounded-md p-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="min-w-4 min-h-4 flex-shrink-0">
                      <FileIcon fileName={file.name} />
                    </div>
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  {onDownload && (
                    <div
                      className="cursor-pointer p-1 rounded-full hover:bg-primary/20 transition-colors"
                      onClick={() => onDownload(file, attachment.key)}
                      title="Fazer download">
                      <Download className="h-4 w-4 text-gray-500 hover:text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {hasExcessFiles && (
              <div className="mt-2">
                <span
                  className="text-xs text-primary cursor-pointer"
                  onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'Ver menos' : 'Ver mais'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentConfigurationPresentation;
