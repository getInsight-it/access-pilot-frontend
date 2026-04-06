import React, { useEffect, useRef, useState } from "react";
import { FileUp, X } from "lucide-react";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { useToast } from "@common/external/ui/use-toast.ts";
import { AttachmentConfigurationInterface } from "@features/client/common/model/configuration.model.ts";
import { FileIcon } from "@common/components/FileIcon.tsx";
import { FileAttachment } from "../../types/access-request.model.ts";
import "./request-justification-step.scss";

const EMPTY_ATTACHMENTS: FileAttachment[] = [];

interface RequestJustificationStepProps {
  onAttach?: (files: FileAttachment[]) => void;
  maxSize?: number;
  requiredAttachments?: AttachmentConfigurationInterface[];
  onReasonChange?: (reason: string) => void;
  initialAttachments?: FileAttachment[];
  initialReason?: string;
  hasError?: {
    attachments?: boolean;
    reason?: boolean;
  };
  readOnlyReason?: boolean;
}

export const RequestJustificationStep: React.FC<RequestJustificationStepProps> = ({
  onAttach,
  maxSize = 5 * 1024 * 1024,
  requiredAttachments = [],
  onReasonChange,
  initialAttachments = EMPTY_ATTACHMENTS,
  initialReason = "",
  hasError = { attachments: false, reason: false },
  readOnlyReason = false
}) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>(initialAttachments);
  const [reason, setReason] = useState<string>(initialReason);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    setAttachments(initialAttachments);
  }, [initialAttachments]);

  useEffect(() => {
    setReason(initialReason);
  }, [initialReason]);

  const validateFileExtension = (file: File, allowedExtensions: string[]): boolean => {
    if(allowedExtensions.length === 0) return true;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    return allowedExtensions.some((extension) => extension.toLowerCase() === fileExtension);
  };

  const upsertFiles = (item: AttachmentConfigurationInterface, validFiles: File[]) => {
    const existingAttachment = attachments.find((attachment) => attachment.key === item.key);
    let nextAttachments: FileAttachment[];

    if(existingAttachment) {
      nextAttachments = attachments.map((attachment) => {
        if(attachment.key === item.key) {
          return {
            ...attachment,
            files: [...attachment.files, ...validFiles]
          };
        }
        return attachment;
      });
    } else {
      nextAttachments = [
        ...attachments,
        {
          key: item.key,
          files: validFiles,
          fileName: item.name
        }
      ];
    }

    setAttachments(nextAttachments);
    onAttach?.(nextAttachments);
  };

  const handleFiles = (files: FileList | null, item: AttachmentConfigurationInterface) => {
    if(!files || files.length === 0) return;

    const validFiles: File[] = [];

    for(let index = 0; index < files.length; index++) {
      const file = files[index];

      if(file.size > maxSize) {
        toast({
          title: t("Erro"),
          description: t("O arquivo {{name}} é muito grande. Tamanho máximo permitido: {{size}}", {
            name: file.name,
            size: `${(maxSize / (1024 * 1024)).toFixed(1)}MB`
          }),
          variant: "destructive"
        });
        continue;
      }

      if(!validateFileExtension(file, item.allowedExtensions)) {
        toast({
          title: t("Erro"),
          description: t("Tipo de arquivo não permitido para {{name}}. Extensões aceitas: {{extensions}}", {
            name: file.name,
            extensions: item.allowedExtensions.join(", ")
          }),
          variant: "destructive"
        });
        continue;
      }

      validFiles.push(file);
    }

    if(validFiles.length === 0) return;

    upsertFiles(item, validFiles);

    if(fileInputRefs.current[item.key]) {
      (fileInputRefs.current[item.key] as HTMLInputElement).value = "";
    }
  };

  const removeFile = (attachmentKey: string, fileIndex: number) => {
    const nextAttachments = attachments
      .map((attachment) => {
        if(attachment.key !== attachmentKey) return attachment;

        const nextFiles = [...attachment.files];
        nextFiles.splice(fileIndex, 1);

        return {
          ...attachment,
          files: nextFiles
        };
      })
      .filter((attachment) => attachment.files.length > 0);

    setAttachments(nextAttachments);
    onAttach?.(nextAttachments);
  };

  const getAttachmentByKey = (key: string) => attachments.find((attachment) => attachment.key === key);

  const formatFileSize = (bytes: number): string => {
    if(bytes < 1024) return `${bytes} bytes`;
    if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextReason = event.target.value;
    setReason(nextReason);
    onReasonChange?.(nextReason);
  };

  const isAttachmentMissing = (key: string): boolean => {
    const configuration = requiredAttachments.find((attachment) => attachment.key === key);
    if(!configuration || !configuration.required) return false;

    const attachment = getAttachmentByKey(key);
    return !!hasError.attachments && (!attachment || attachment.files.length === 0);
  };

  return (
    <div className="request-justification-step">
      <div className="request-justification-step__reason-section">
        <label className="request-justification-step__label" htmlFor="request-reason">
          {t("Motivo da solicitação")} <span className="request-justification-step__required">*</span>
        </label>
        <textarea
          id="request-reason"
          value={reason}
          onChange={handleReasonChange}
          placeholder={t("Descreva o motivo da sua solicitação")}
          className={`app-textarea request-justification-step__textarea${hasError.reason ? " request-justification-step__textarea--error" : ""}${readOnlyReason ? " request-justification-step__textarea--locked" : ""}`}
          readOnly={readOnlyReason}
        />
        {hasError.reason && (
          <p className="request-justification-step__error">{t("Por favor, informe o motivo da solicitação.")}</p>
        )}
      </div>

      {requiredAttachments.length > 0 && (
        <div className="request-justification-step__attachments-section">
          <h4 className="request-justification-step__attachments-title">{t("Anexos necessários")}</h4>

          <div className="request-justification-step__grid">
            {requiredAttachments.map((item) => {
              const attachment = getAttachmentByKey(item.key);
              const hasFiles = !!attachment && attachment.files.length > 0;
              const isMissing = isAttachmentMissing(item.key);
              const extensionsText = item.allowedExtensions.join(", ");

              return (
                <div
                  key={item.key}
                  className={`request-justification-step__card${!hasFiles ? " request-justification-step__card--empty" : ""}${isMissing ? " request-justification-step__card--error" : ""}`}
                >
                  <div className="request-justification-step__card-header">
                    <p className="request-justification-step__card-title">
                      {item.name}
                      {item.required && <span className="request-justification-step__required"> *</span>}
                    </p>
                  </div>

                  <label
                    className="request-justification-step__dropzone"
                    htmlFor={`request-attachment-${item.key}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleFiles(event.dataTransfer.files, item);
                    }}
                  >
                    <FileUp className="request-justification-step__dropzone-icon" />
                    <p className="request-justification-step__dropzone-text">
                      {t("Clique para selecionar ou arraste o(s) arquivo(s)")}
                    </p>
                    <p className="request-justification-step__dropzone-hint">({extensionsText})</p>
                  </label>

                  <input
                    id={`request-attachment-${item.key}`}
                    className="request-justification-step__file-input"
                    type="file"
                    multiple
                    ref={(element) => {
                      fileInputRefs.current[item.key] = element;
                    }}
                    onChange={(event) => handleFiles(event.target.files, item)}
                  />

                  {hasFiles && (
                    <div className="request-justification-step__file-list">
                      {attachment.files.map((file, index) => (
                        <div key={`${item.key}-${index}`} className="request-justification-step__file-item">
                          <div className="request-justification-step__file-main">
                            <FileIcon fileName={file.name} />
                            <div className="request-justification-step__file-text">
                              <p className="request-justification-step__file-name">{file.name}</p>
                              <p className="request-justification-step__file-meta">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="request-justification-step__remove-button"
                            onClick={() => removeFile(item.key, index)}
                            aria-label={t("Remover arquivo")}
                          >
                            <X className="request-justification-step__remove-icon" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isMissing && (
                    <p className="request-justification-step__error">{t("Este anexo é obrigatório.")}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
