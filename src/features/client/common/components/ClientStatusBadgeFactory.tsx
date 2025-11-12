import { ClientStatusEnum, ClientStatusTranslationEnum } from "../enum/client-status.enum.ts";
import { Badge } from "@ui/badge.tsx";

export const ClientStatusBadgeFactory = (status: string) => {
  const statusLabel = status === ClientStatusEnum.PUBLISHED
    ? ClientStatusTranslationEnum.PUBLISHED
    : ClientStatusTranslationEnum.UNPUBLISHED;

  switch (status) {
    case ClientStatusEnum.PUBLISHED:
      return <Badge variant="success">{statusLabel}</Badge>;
    case ClientStatusEnum.UNPUBLISHED:
      return <Badge variant="warning">{statusLabel}</Badge>;
    default:
      return <Badge variant="secondary">{statusLabel}</Badge>;
  }
};
