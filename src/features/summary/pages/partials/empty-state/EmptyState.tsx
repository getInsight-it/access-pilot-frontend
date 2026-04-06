import { LaptopMinimal } from "lucide-react";
import { FC } from "react";
import "./empty-state.scss";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }) => (
  <div className="dashboard-empty-state">
    <div className="dashboard-empty-state__icon-box">
      <LaptopMinimal className="dashboard-empty-state__icon" />
    </div>
    <span className="dashboard-empty-state__message">{message}</span>
  </div>
);
