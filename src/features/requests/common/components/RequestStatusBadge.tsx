import { REQUEST_STATUS_ENUM, REQUEST_STATUS_PRESENTATION_NAME_ENUM } from "../types/request.enum.ts";
import { Badge } from "../../../../components/ui/badge.tsx";

export const RequestStatusBadge = (status: string) => {
  const presentationName = REQUEST_STATUS_PRESENTATION_NAME_ENUM[status as keyof typeof REQUEST_STATUS_PRESENTATION_NAME_ENUM];

  switch(status) {
    case REQUEST_STATUS_ENUM.APPROVED: return (<Badge variant="success">{presentationName}</Badge>);
    case REQUEST_STATUS_ENUM.PENDING: return (<Badge variant="warning">{presentationName}</Badge>);
    case REQUEST_STATUS_ENUM.CANCELED: return (<Badge variant="destructive">{presentationName}</Badge>);
    case REQUEST_STATUS_ENUM.CREATED: return (<Badge variant="info">{presentationName}</Badge>);
    case REQUEST_STATUS_ENUM.REJECTED: return (<Badge variant="destructive">{presentationName}</Badge>);
    default: return <span>{presentationName}</span>
  }
}
