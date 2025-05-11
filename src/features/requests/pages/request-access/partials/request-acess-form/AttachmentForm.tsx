import React, { useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import clsx from "clsx";
import { Button } from "../../../../../../components/ui/button.tsx";
import { useToast } from "../../../../../../components/ui/use-toast";
import { Card } from "../../../../../../components/ui/card.tsx";
import { Textarea } from "../../../../../../components/ui/textarea.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../components/ui/popover.tsx";

import { FileIcon } from "../../../../../../common/components/FileIcon.tsx";
import { AttachmentConfigurationInterface } from "../../../../../client/common/model/configuration.model.ts";

interface AttachmentFormProps {
  onAttach?: (files: FileAttachment[]) => void;
  maxSize?: number;
  className?: string;
  requiredAttachments?: AttachmentConfigurationInterface[];
  onReasonChange?: (reason: string) => void;
  initialAttachments?: FileAttachment[];
  initialReason?: string;
}

export interface FileAttachment {
  key: string;
  files: File[];
  fileName: string;
}

const AttachmentForm: React.FC<AttachmentFormProps> = ({
  onAttach,
  maxSize = 5 * 1024 * 1024,
  className,
  requiredAttachments = [],
  onReasonChange,
  initialAttachments = [],
  initialReason = ""
}) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>(initialAttachments);
  const [reason, setReason] = useState<string>(initialReason);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialAttachments.length > 0) setAttachments(initialAttachments);
  }, [initialAttachments]);

  useEffect(() => {
    if (initialReason) setReason(initialReason);
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
        fileName: item.description
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
    setReason(e.target.value);
    if(onReasonChange) onReasonChange(e.target.value);
  };

  const formatFileSize = (bytes: number): string => {
    if(bytes < 1024) return bytes + " bytes";
    if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={clsx("w-full space-y-6", className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="request-reason" className="text-xl font-bold">
          Motivo da solicitação
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="request-reason"
          value={reason}
          onChange={handleReasonChange}
          className="resize-none"
          placeholder="Descreva o motivo da sua solicitação" />
      </div>

      <div className="pt-2">
        <h3 className="text-xl font-bold mb-2">Anexos necessários:</h3>
        <div className="space-y-4">
          {requiredAttachments.map((item) => (
            <Card key={item.key} className="flex flex-col gap-2 border rounded-md p-4 bg-[var(--system-card)]">
              <Label htmlFor={`file-upload-${item.key}`}>
                {item.description}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              <div className="flex flex-col gap-2">
                {getAttachmentByName(item.key) && getAttachmentByName(item.key)!.files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {getAttachmentByName(item.key)?.files.map((file, index) => (
                      <Card
                        key={`${item.key}-${index}`}
                        className="relative w-full h-[70px] flex flex-col items-center justify-center p-2 bg-secondary">
                        <button
                          onClick={() => removeFile(item.key, index)}
                          className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                          aria-label="Remover arquivo"
                          type="button">
                          <X className="h-3 w-3" />
                        </button>

                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className="cursor-pointer gap-1 w-full h-full flex flex-col items-center justify-center">
                              <FileIcon fileName={file.name}></FileIcon>
                              <span className="text-[10px] text-center line-clamp-1 break-all">{file.name}</span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <div>
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

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-40 bg-primary text-primary-foreground"
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

                <div className="text-xs text-gray-500">
                  Formatos aceitos: {item.allowedExtensions.join(", ")}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentForm;
