import { AttachmentConfigurationInterface } from "../../../client/common/model/configuration.model.ts";

export interface RequestAttachmentInterface {
  id: number;
  uuid: string;
  file: RequestAttachmentFileInterface;
  configuration: AttachmentConfigurationInterface;
}

export interface RequestAttachmentFileInterface {
  id: number;
  originalFilename: string;
  filesize: number;
  mimeType: string;
  fileId: string;
}
