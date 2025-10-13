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
    <div className={clsx("w-full space-y-4 sm:space-y-6", className)}>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="request-reason"
          className={cn(
            "text-lg sm:text-xl font-bold",
            hasError.reason && "text-red-500"
          )}>
          Motivo da solicitação
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="request-reason"
          value={reason}
          onChange={handleReasonChange}
          className={cn(
            "resize-none min-h-[100px] sm:min-h-[120px]",
            hasError.reason && "border-red-500 focus-visible:ring-red-500"
          )}
          placeholder="Descreva o motivo da sua solicitação" />
        {hasError.reason && (
          <p className="text-red-500 text-sm mt-1">
            Por favor, informe o motivo da solicitação
          </p>
        )}
      </div>

      <div className="pt-2">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Anexos necessários:</h3>
        <div className="space-y-3 sm:space-y-4">
          {requiredAttachments.map((item) => {
            const isMissing = isAttachmentMissing(item.key);

            return (
              <Card
                key={item.key}
                className={cn(
                  "flex flex-col gap-2 sm:gap-3 border rounded-md p-3 sm:p-4 bg-[var(--system-card)]",
                  isMissing && "border-red-500"
                )}>
                <Label
                  htmlFor={`file-upload-${item.key}`}
                  className={cn("text-sm sm:text-base", isMissing && "text-red-500")}>
                  {item.name}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                <div className="flex flex-col gap-2 sm:gap-3">
                  {getAttachmentByName(item.key) && getAttachmentByName(item.key)!.files.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {getAttachmentByName(item.key)?.files.map((file, index) => (
                        <Card
                          key={`${item.key}-${index}`}
                          className="relative w-full h-[70px] sm:h-[80px] flex flex-col items-center justify-center p-2 bg-secondary">
                          <button
                            onClick={() => removeFile(item.key, index)}
                            className="absolute top-1 right-1 text-gray-400 hover:text-red-500 z-10"
                            aria-label="Remover arquivo"
                            type="button">
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>

                          <Popover>
                            <PopoverTrigger asChild>
                              <div
                                className="cursor-pointer gap-1 w-full h-full flex flex-col items-center justify-center">
                                <FileIcon fileName={file.name}></FileIcon>
                                <span className="text-[9px] sm:text-[10px] text-center line-clamp-1 break-all px-1">{file.name}</span>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80">
                              <div className="space-y-2 text-sm">
                                <div className="break-words">
                                  <span className="font-medium">Nome:</span> {file.name}
                                </div>
                                <div>
                                  <span className="font-medium">Tamanho:</span> {formatFileSize(file.size)}
                                </div>
                                <div>
                                  <span className="font-medium">Tipo:</span> {file.type || "Não especificado"}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-40 bg-primary text-primary-foreground"
                      onClick={() => triggerFileInput(item.key)}>
                      Escolher arquivos
                    </Button>
                    <input
                      id={`file-upload-${item.key}`}
                      type="file"
                      multiple
                      ref={(el) => (fileInputRefs.current[item.key] = el)}
                      onChange={(e) => handleFileChange(e, item)}
                      className="hidden" />
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 break-words">
                    Formatos aceitos: {item.allowedExtensions.join(", ")}
                  </div>

                  {isMissing && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      Este anexo é obrigatório
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttachmentStep;
