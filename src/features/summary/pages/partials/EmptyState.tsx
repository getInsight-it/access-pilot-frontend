import { LaptopMinimal } from "lucide-react";
import { FC } from "react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }) => (
  <div>
    <div>
      <LaptopMinimal size={24} />
    </div>
    <span>{message}</span>
  </div>
);
