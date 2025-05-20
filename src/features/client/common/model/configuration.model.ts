export interface AttachmentConfigurationInterface {
  id?: number;
  uuid?: string;
  key: string;
  name: string;
  description: string;
  required: boolean;
  allowedExtensions: string[];
  active?: boolean;
}

export const AVAILABLE_EXTENSIONS = ["PDF", "JPEG", "JPG", "PNG", "DOC", "DOCX"];
