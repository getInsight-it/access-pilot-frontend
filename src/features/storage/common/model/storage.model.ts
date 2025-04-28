export interface StorageModel {
  id?: number;
  excluded: true;
  originalFilename: string;
  filesize: 0;
  mimeType: string;
  bucket: string;
  isPublic: true;
  ephemeral: true;
  downloadCount: 0;
  fileId: string;
  ownerId: string;
  requestId: string;
}
