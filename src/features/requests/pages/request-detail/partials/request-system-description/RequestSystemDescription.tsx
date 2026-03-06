import { MonitorIcon as MonitorCog } from "lucide-react";
import { ShuffleLoader } from "../../../../../../common/components/loading/ShuffleLoader.tsx";
import TruncatedText from "../../../../../../common/components/TruncatedText.tsx";
import "./request-system-description.scss";

interface RequestSystemDescriptionProps {
  clientName?: string;
  clientDescription?: string;
  isContentLoading: boolean;
}

const RequestSystemDescription = ({
  clientName,
  clientDescription,
  isContentLoading
}: RequestSystemDescriptionProps) => {
  if(isContentLoading) {
    return (
      <div className="request-system-description request-system-description--loading">
        <ShuffleLoader />
      </div>
    );
  }

  return (
    <div className="request-system-description">
      <div className="request-system-description__header">
        <div className="request-system-description__icon-box">
          <MonitorCog className="request-system-description__icon" />
        </div>
        <h3 className="request-system-description__title">Sistema</h3>
      </div>

      <div className="request-system-description__content">
        <p className="request-system-description__name">{clientName || "Sistema não informado"}</p>
        <TruncatedText
          className="request-system-description__description"
          text={clientDescription || "Sem descrição disponível."}
          autoManage={true}
          maxLines={3}
        />
      </div>
    </div>
  );
};

export default RequestSystemDescription;
