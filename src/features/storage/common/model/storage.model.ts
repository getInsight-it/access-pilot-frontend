export interface StorageModel {
  id?: number;
  excluded: boolean;
  originalFilename: string;
  filesize: number;
  mimeType: string;
  bucket: string;
  isPublic: boolean;
  ephemeral: boolean;
  downloadCount: number;
  fileId: string;
  ownerId: string;
  requestId: string;
}
