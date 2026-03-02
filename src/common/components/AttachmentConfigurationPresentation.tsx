import { FC, useState } from "react";
import { Download, Folder } from "lucide-react";
import { FileIcon } from "./FileIcon.tsx";
import { cn } from "../../config/lib/utils.ts";

export interface FileAttachment {
  key: string;
  files: File[] | any[];
  fileName: string;
}

interface AttachmentConfigurationPresentationProps {
  attachments: FileAttachment[];
  direction?: "row" | "column";
  onDownload?: (file: File) => any;
  className?: string;
  collapsible?: boolean;
  itemsPerRow?: number;
}

export const AttachmentConfigurationPresentation: FC<AttachmentConfigurationPresentationProps> = ({
  attachments,
  direction = "column",
  onDownload,
  className,
  collapsible = false,
  itemsPerRow = 2
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if(!attachments || attachments.length === 0) {
    return (
      <div>
        <div>
          <Folder size={20} />
        </div>
        <div>
          <p>
            Anexos
          </p>
          <div>
            <span>
              Nenhum anexo fornecido.
            </span>
          </div>
        </div>
      </div>
    );
  }

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getGridColsClass = () => {
    if (direction === "row") return "grid-cols-1";

    switch (itemsPerRow) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case 5: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case 6: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
      default: return "grid-cols-1 sm:grid-cols-2";
    }
  };

  return (
    <div className={cn(className)}>
      {attachments.map((attachment) => {
        const isExpanded = expandedItems[attachment.key] || false;
        const hasExcessFiles = collapsible && attachment.files.length > 3;
        const displayFiles = hasExcessFiles && !isExpanded ? attachment.files.slice(0, 3) : attachment.files;

        return (
          <div key={attachment.key}>
            <div>
              <p>
                {attachment.fileName}
              </p>
              <div>
                <div>
                  {displayFiles.map((file, index) => (
                    <div
                      key={`${attachment.key}-${index}`}
                    >
                      <div>
                        <div>
                          <FileIcon fileName={file.name} />
                        </div>
                        <span>
                          {file.name}
                        </span>
                      </div>
                      {onDownload && (
                        <button
                          onClick={() => onDownload(file)}
                          title="Fazer download"
                        >
                          <Download />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {hasExcessFiles && (
                  <div>
                    <button
                      onClick={() => toggleExpanded(attachment.key)}
                    >
                      {isExpanded
                        ? `Ver menos (${attachment.files.length - 3} arquivos ocultos)`
                        : `Ver mais ${attachment.files.length - 3} arquivos`
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentConfigurationPresentation;
