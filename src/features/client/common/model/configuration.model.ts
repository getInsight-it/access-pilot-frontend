export interface AttachmentConfigurationInterface {
  key: string;
  description: string;
  required: boolean;
  allowedExtensions: string[];
}

export const AVAILABLE_EXTENSIONS = ["PDF", "JPEG", "JPG", "PNG", "DOC", "DOCX"];
