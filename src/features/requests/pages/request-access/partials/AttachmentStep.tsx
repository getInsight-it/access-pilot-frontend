import React, { useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import clsx from "clsx";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { useToast } from "../../../../../common/external/ui/use-toast.ts";
import { Card } from "../../../../../common/external/ui/card.tsx";
import { Textarea } from "../../../../../common/external/ui/textarea.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { cn } from "../../../../../config/lib/utils.ts";
import { FileIcon } from "../../../../../common/components/FileIcon.tsx";
import { AttachmentConfigurationInterface } from "../../../../client/common/model/configuration.model.ts";

interface AttachmentFormProps {
  onAttach?: (files: FileAttachment[]) => void;
  maxSize?: number;
  className?: string;
  requiredAttachments?: AttachmentConfigurationInterface[];
  onReasonChange?: (reason: string) => void;
  initialAttachments?: FileAttachment[];
  initialReason?: string;
  hasError?: {
    attachments?: boolean;
    reason?: boolean;
  };
}

export interface FileAttachment {
  key: string;
  files: File[];
  fileName: string;
}

const AttachmentStep: React.FC<AttachmentFormProps> = ({
  onAttach,
  maxSize = 5 * 1024 * 1024,
  className,
  requiredAttachments = [],
  onReasonChange,
  initialAttachments = [],
  initialReason = "",
  hasError = { attachments: false, reason: false }
}) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>(initialAttachments);
  const [reason, setReason] = useState<string>(initialReason);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  useEffect(() => {
    if(initialAttachments.length > 0) setAttachments(initialAttachments);
  }, [initialAttachments]);

  useEffect(() => {
    if(initialReason) setReason(initialReason);
  }, [initialReason]);

  const validateFileExtension = (file: File, allowedExtensions: string[]): boolean => {
    if(allowedExtensions.length === 0) return true;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    return allowedExtensions.some(ext => ext.toLowerCase() === fileExtension);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, item: AttachmentConfigurationInterface) => {
    const selectedFiles = event.target.files;
    if(!selectedFiles || selectedFiles.length === 0) return;

    const validFiles: File[] = [];

    for(let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if(file.size > maxSize) {
        toast({
          title: "Erro",
          description: `O arquivo ${file.name} é muito grande. Tamanho máximo permitido: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
          variant: "destructive"
        });
        continue;
      }

      if(!validateFileExtension(file, item.allowedExtensions)) {
        toast({
          title: "Erro",
          description: `Tipo de arquivo não permitido para ${file.name}. Extensões aceitas: ${item.allowedExtensions.join(", ")}`,
          variant: "destructive"
        });
        continue;
      }

      validFiles.push(file);
    }

    if(validFiles.length === 0) return;

    const existingAttachment = attachments.find(attachment => attachment.key === item.key);
    let newAttachments: FileAttachment[];

    if(existingAttachment) {
      newAttachments = attachments.map(attachment => {
        if(attachment.key === item.key) {
          return {
            ...attachment,
            files: [...attachment.files, ...validFiles],
            fileName: attachment.fileName
          };
        }
        return attachment;
      });
    } else {
      newAttachments = [...attachments, {
        key: item.key,
        files: validFiles,
        fileName: item.name
      }];
    }

    setAttachments(newAttachments);
    if(onAttach) onAttach(newAttachments);
    if(fileInputRefs.current[item.key]) {
      (fileInputRefs.current[item.key] as HTMLInputElement).value = "";
    }
  };

  const removeFile = (attachmentName: string, fileIndex: number) => {
    const newAttachments = attachments.map(attachment => {
      if(attachment.key === attachmentName) {
        const newFiles = [...attachment.files];
        newFiles.splice(fileIndex, 1);

        return {
          ...attachment,
          files: newFiles
        };
      }
      return attachment;
    }).filter(attachment => attachment.files.length > 0);

    setAttachments(newAttachments);
    if(onAttach) onAttach(newAttachments);
  };

  const triggerFileInput = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const getAttachmentByName = (key: string) => {
    return attachments.find(attachment => attachment.key === key);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReason = e.target.value;
    setReason(newReason);
    if(onReasonChange) onReasonChange(newReason);
  };

  const formatFileSize = (bytes: number): string => {
    if(bytes < 1024) return bytes + " bytes";
    if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isAttachmentMissing = (key: string): boolean | undefined => {
    const config = requiredAttachments.find(item => item.key === key);
    if(!config || !config.required) return false;

    const attachment = getAttachmentByName(key);
    return hasError.attachments && (!attachment || attachment.files.length === 0);
  };

  return (
    <div className={clsx(className)}>
      <div>
        <Label
          htmlFor="request-reason">
          Motivo da solicitação
          <span>*</span>
        </Label>
        <Textarea
          id="request-reason"
          value={reason}
          onChange={handleReasonChange}
          placeholder="Descreva o motivo da sua solicitação" />
        {hasError.reason && (
          <p>
            Por favor, informe o motivo da solicitação
          </p>
        )}
      </div>

      {requiredAttachments.length > 0 && (
        <div>
          <h3>Anexos necessários:</h3>
          <div>
            {requiredAttachments.map((item) => {
            const isMissing = isAttachmentMissing(item.key);

            return (
              <Card
                key={item.key}>
                <Label
                  htmlFor={`file-upload-${item.key}`}>
                  {item.name}
                  {item.required && <span>*</span>}
                </Label>

                <div>
                  {getAttachmentByName(item.key) && getAttachmentByName(item.key)!.files.length > 0 && (
                    <div>
                      {getAttachmentByName(item.key)?.files.map((file, index) => (
                        <Card
                          key={`${item.key}-${index}`}>
                          <button
                            onClick={() => removeFile(item.key, index)}
                            aria-label="Remover arquivo"
                            type="button">
                            <X />
                          </button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <div>
                                <FileIcon fileName={file.name}></FileIcon>
                                <span>{file.name}</span>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div>
                                <div>
                                  <span>Nome:</span> {file.name}
                                </div>
                                <div>
                                  <span>Tamanho:</span> {formatFileSize(file.size)}
                                </div>
                                <div>
                                  <span>Tipo:</span> {file.type || "Não especificado"}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => triggerFileInput(item.key)}>
                      Escolher arquivos
                    </Button>
                    <input
                      id={`file-upload-${item.key}`}
                      type="file"
                      multiple
                      ref={(el) => (fileInputRefs.current[item.key] = el)}
                      onChange={(e) => handleFileChange(e, item)}
                      style={{ display: "none" }} />
                  </div>

                  <div>
                    Formatos aceitos: {item.allowedExtensions.join(", ")}
                  </div>

                  {isMissing && (
                    <p>
                      Este anexo é obrigatório
                    </p>
                  )}
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentStep;
