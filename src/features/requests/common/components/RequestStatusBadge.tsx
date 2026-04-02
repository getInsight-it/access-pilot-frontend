import { REQUEST_STATUS_ENUM, REQUEST_STATUS_PRESENTATION_NAME_ENUM } from "../types/request.enum.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./RequestStatusBadge.scss";

export const RequestStatusBadge = (status: string) => {
  const { t } = useI18n();
  const presentationName = t(
    REQUEST_STATUS_PRESENTATION_NAME_ENUM[status as keyof typeof REQUEST_STATUS_PRESENTATION_NAME_ENUM] || "Desconhecido"
  );

  let modifier = "unknown";

  switch (status) {
    case REQUEST_STATUS_ENUM.CREATED:
      modifier = "created";
      break;
    case REQUEST_STATUS_ENUM.APPROVED:
      modifier = "approved";
      break;
    case REQUEST_STATUS_ENUM.PENDING:
      modifier = "pending";
      break;
    case REQUEST_STATUS_ENUM.CANCELED:
      modifier = "canceled";
      break;
    case REQUEST_STATUS_ENUM.REJECTED:
      modifier = "rejected";
      break;
    case REQUEST_STATUS_ENUM.REVOKED:
      modifier = "revoked";
      break;
    default:
      modifier = "unknown";
      break;
  }

  return (
    <span className={`request-status-badge request-status-badge--${modifier}`}>
      <span className="request-status-badge__dot" />
      <span>{presentationName}</span>
    </span>
  );
};
