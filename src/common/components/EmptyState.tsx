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
  <div className={cn(className)}>
    <div>
      <Icon size={24} />
    </div>
    <h3>
      {message}
    </h3>
    {description && (
      <p>
        {description}
      </p>
    )}
    {action && (
      <div>
        {action}
      </div>
    )}
  </div>
);

