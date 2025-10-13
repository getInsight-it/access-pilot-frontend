import { LucideIcon, Inbox } from "lucide-react";
import { FC, ReactNode } from "react";
import { cn } from "../../config/lib/utils.ts";

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ 
  message, 
  description,
  icon: Icon = Inbox,
  action,
  className 
}) => (
  <div className={cn("flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4", className)}>
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
      <Icon size={24} className="text-gray-400 dark:text-gray-500 sm:w-8 sm:h-8" />
    </div>
    <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
      {message}
    </h3>
    {description && (
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {description}
      </p>
    )}
    {action && (
      <div className="mt-4 sm:mt-6">
        {action}
      </div>
    )}
  </div>
);

