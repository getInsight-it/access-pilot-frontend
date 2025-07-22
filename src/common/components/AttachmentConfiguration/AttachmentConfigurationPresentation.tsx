import { FC, useState } from "react";
import { Download, FileText, Folder } from "lucide-react";
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
      <div className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
        <div className="flex-shrink-0 mr-4">
          <Folder size={20} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
            Anexos
          </p>
          <div className="mt-1">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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
    <div className={cn(
      direction === "column" ? `grid gap-4 ${getGridColsClass()}` : "space-y-4",
      className
    )}>
      {attachments.map((attachment) => {
        const isExpanded = expandedItems[attachment.key] || false;
        const hasExcessFiles = collapsible && attachment.files.length > 3;
        const displayFiles = hasExcessFiles && !isExpanded ? attachment.files.slice(0, 3) : attachment.files;

        return (
          <div key={attachment.key} className="flex flex-row items-start border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-[12px] p-4">
            <div className="flex flex-col flex-grow">
              <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
                {attachment.fileName}
              </p>
              <div className="mt-3">
                <div
                  className={cn(
                    "grid gap-2 grid-cols-1"
                  )}
                >
                  {displayFiles.map((file, index) => (
                    <div
                      key={`${attachment.key}-${index}`}
                      className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-100 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="min-w-4 min-h-4 flex-shrink-0">
                          <FileIcon fileName={file.name} />
                        </div>
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 truncate">
                          {file.name}
                        </span>
                      </div>
                      {onDownload && (
                        <button
                          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => onDownload(file, attachment.key)}
                          title="Fazer download"
                        >
                          <Download className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {hasExcessFiles && (
                  <div className="mt-3">
                    <button
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors"
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
