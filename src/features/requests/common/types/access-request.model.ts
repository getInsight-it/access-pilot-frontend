export interface FileAttachment {
  key: string;
  files: File[];
  fileName: string;
}

export interface RequestStepItem {
  id: number;
  number: number;
  title: string;
  description: string;
}
