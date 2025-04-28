import React, { useState, useRef } from 'react';
import { Label } from '@radix-ui/react-label';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { Button } from "../../../../../../components/ui/button.tsx";
import { useToast } from "../../../../../../components/ui/use-toast";
import { Card } from "../../../../../../components/ui/card.tsx";
import { Textarea } from "../../../../../../components/ui/textarea.tsx";
import { ScrollArea } from "../../../../../../components/ui/scroll-area.tsx";

interface AttachmentFormProps {
  onAttach?: (files: Array<{name: string, file: File, fileName: string}>) => void;
  maxSize?: number;
  className?: string;
  requiredAttachments?: ClientRequiredAttachments[];
  onReasonChange?: (reason: string) => void;
}

interface ClientRequiredAttachments {
  name: string;
  description: string;
  required: boolean;
  allowedExtensions: string[];
}

interface FileAttachment {
  name: string;
  file: File;
  fileName: string;
}

const AttachmentForm: React.FC<AttachmentFormProps> = ({
  onAttach,
  maxSize = 5 * 1024 * 1024,
  className,
  requiredAttachments = [],
  onReasonChange,
}) => {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [reason, setReason] = useState<string>('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  const validateFileExtension = (file: File, allowedExtensions: string[]): boolean => {
    if (allowedExtensions.length === 0) return true;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.some(ext => ext.toLowerCase() === fileExtension);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, item: ClientRequiredAttachments) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      toast({
        title: "Erro",
        description: `O arquivo é muito grande. Tamanho máximo permitido: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
        variant: "destructive"
      });
      return;
    }

    if (!validateFileExtension(selectedFile, item.allowedExtensions)) {
      toast({
        title: "Erro",
        description: `Tipo de arquivo não permitido. Extensões aceitas: ${item.allowedExtensions.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    const existingIndex = attachments.findIndex(attachment => attachment.name === item.name);

    let newAttachments: FileAttachment[];
    const newAttachment = {
      name: item.name,
      file: selectedFile,
      fileName: selectedFile.name
    };

    if (existingIndex >= 0) {
      newAttachments = [...attachments];
      newAttachments[existingIndex] = newAttachment;
    } else {
      newAttachments = [...attachments, newAttachment];
    }

    setAttachments(newAttachments);

    if (onAttach) onAttach(newAttachments);
  };

  const removeFile = (attachmentName: string) => {
    const newAttachments = attachments.filter(attachment => attachment.name !== attachmentName);
    setAttachments(newAttachments);

    if (fileInputRefs.current[attachmentName]) (fileInputRefs.current[attachmentName] as HTMLInputElement).value = '';
    if (onAttach) onAttach(newAttachments);
  };

  const triggerFileInput = (name: string) => {
    fileInputRefs.current[name]?.click();
  };

  const getAttachmentByName = (name: string) => {
    return attachments.find(attachment => attachment.name === name);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (onReasonChange) onReasonChange(e.target.value);
  };

  return (
    <div className={clsx('w-full space-y-6', className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="request-reason" className="text-xl font-bold">Motivo da solicitação</Label>
        <Textarea
          id="request-reason"
          value={reason}
          onChange={handleReasonChange}
          className="resize-none"
          placeholder="Descreva o motivo da sua solicitação"/>
      </div>

      <div className="pt-2">
        <h3 className="text-xl font-bold mb-2">Anexos necessários:</h3>
        <div className="space-y-4">
          {requiredAttachments.map((item) => (
            <Card key={item.name} className="flex flex-col gap-2 border rounded-md p-4">
              <Label htmlFor={`file-upload-${item.name}`}>
                {item.description}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-40 bg-primary text-primary-foreground"
                    onClick={() => triggerFileInput(item.name)}>
                    Selecionar arquivo
                  </Button>
                  <input
                    id={`file-upload-${item.name}`}
                    type="file"
                    ref={(el) => (fileInputRefs.current[item.name] = el)}
                    onChange={(e) => handleFileChange(e, item)}
                    className="hidden" />
                  <span className="text-sm text-gray-500">
                  {getAttachmentByName(item.name)
                    ? getAttachmentByName(item.name)?.fileName
                    : 'Nenhum arquivo selecionado'}
                </span>

                  {getAttachmentByName(item.name) && (
                    <button
                      type="button"
                      onClick={() => removeFile(item.name)}
                      className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Formatos aceitos: {item.allowedExtensions.join(', ')}
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
