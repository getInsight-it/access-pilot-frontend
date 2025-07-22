import { LaptopMinimal } from "lucide-react";
import { FC } from "react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
      <LaptopMinimal size={24} className="text-gray-400" />
    </div>
    <span className="text-sm text-gray-500">{message}</span>
  </div>
);
