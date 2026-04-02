import { FC, useState } from "react";
import { Download, Folder } from "lucide-react";
import { FileIcon } from "./FileIcon.tsx";
import { cn } from "../../config/lib/utils.ts";
import { useI18n } from "../context/i18n/I18nContext.tsx";
import "./AttachmentConfigurationPresentation.scss";

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
  const { t } = useI18n();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if(!attachments || attachments.length === 0) {
    return (
      <div className={cn("attachment-configuration-presentation", "attachment-configuration-presentation--empty", className)}>
        <div className="attachment-configuration-presentation__empty-icon-box">
          <Folder className="attachment-configuration-presentation__empty-icon" />
        </div>
        <div className="attachment-configuration-presentation__empty-content">
          <p className="attachment-configuration-presentation__empty-title">{t("Anexos")}</p>
          <span className="attachment-configuration-presentation__empty-text">{t("Nenhum anexo informado.")}</span>
        </div>
      </div>
    );
  }

  const toggleExpanded = (key: string) => {
    setExpandedItems((previous) => ({
      ...previous,
      [key]: !previous[key]
    }));
  };

  return (
    <div
      className={cn(
        "attachment-configuration-presentation",
        `attachment-configuration-presentation--direction-${direction}`,
        `attachment-configuration-presentation--columns-${itemsPerRow}`,
        className
      )}
    >
      {attachments.map((attachment) => {
        const isExpanded = expandedItems[attachment.key] || false;
        const hasExcessFiles = collapsible && attachment.files.length > 3;
        const displayFiles = hasExcessFiles && !isExpanded ? attachment.files.slice(0, 3) : attachment.files;

        return (
          <article key={attachment.key} className="attachment-configuration-presentation__group">
            <p className="attachment-configuration-presentation__group-title">{attachment.fileName}</p>

            <div className="attachment-configuration-presentation__files">
              {displayFiles.map((file, index) => (
                <div key={`${attachment.key}-${index}`} className="attachment-configuration-presentation__file-row">
                  <div className="attachment-configuration-presentation__file-main">
                    <div className="attachment-configuration-presentation__file-icon-box">
                      <FileIcon fileName={file.name} />
                    </div>
                    <span className="attachment-configuration-presentation__file-name">{file.name}</span>
                  </div>

                  {onDownload && (
                    <button
                      type="button"
                      className="attachment-configuration-presentation__download-button"
                      onClick={() => onDownload(file)}
                      title={t("Fazer download")}
                    >
                      <Download className="attachment-configuration-presentation__download-icon" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {hasExcessFiles && (
              <div className="attachment-configuration-presentation__toggle-row">
                <button
                  type="button"
                  className="attachment-configuration-presentation__toggle-button"
                  onClick={() => toggleExpanded(attachment.key)}
                >
                  {isExpanded
                    ? t("Ver menos ({{count}} arquivos ocultos)", { count: attachment.files.length - 3 })
                    : t("Ver mais {{count}} arquivos", { count: attachment.files.length - 3 })
                  }
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default AttachmentConfigurationPresentation;
