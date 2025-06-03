import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, SquareArrowOutUpRight } from "lucide-react";
import type { NotificationModel } from "../../common/types/notification/notification.model.ts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { Button } from "../ui/button.tsx";
import { Separator } from "../ui/separator.tsx";
import { notificationService } from "../../common/service/notification-service.ts";
import { toast } from "../ui/use-toast.ts";
import { useAuth } from "../../common/context/auth/AuthContext.tsx";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const authData = useAuth();
  const pageSize = 80

  useEffect(() => {
    if(isOpen && authData && hasMoreItems) {
      loadNotifications();
    }
  }, [isOpen, authData]);

  useEffect(() => {
    if(!isOpen) {
      setPage(1);
      setNotifications([]);
      setHasMoreItems(true);
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);

    try {
      const notificationsResponse = await notificationService.getNotifications(
        "WEB",
        page,
        pageSize,
        "id",
        "DESC",
        authData.user.id
      );

      const newNotifications = [...notifications, ...notificationsResponse.items];

      setPage(page + 1);
      setNotifications(newNotifications);
      setHasMoreItems(notificationsResponse.total > newNotifications.length);
    } catch (error) {
      toast({
        variant: "default",
        title: "Erro",
        description: "Erro ao carregar notificações."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div className="flex items-center space-x-4">
      <div>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-0 max-h-[60vh] flex flex-col z-[100]">
            <header className="flex flex-row justify-between items-center p-4">
              <h4 className="text-lg font-semibold">Notificações</h4>
              <div className="flex flex-row gap-1 items-center cursor-pointer">
                {/* TODO trocar cor para accent */}
                <CheckCheck className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-500">Marcar todas como lido</span>
              </div>
            </header>
            <Separator />
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => (
                <div className="flex flex-row justify-between items-center | p-4 | border-b border-gray-100" key={notification.id}>
                  <p>{notification.title}</p>
                  <div className="flex flex-row gap-2">
                    {/* TODO trocar cor para accent */}
                    {notification.isOpened
                      ? <CheckCheck className="h-4 w-4 text-blue-500" />
                      : <Check className="h-4 w-4 text-gray-400 cursor-pointer" />
                    }
                    <SquareArrowOutUpRight className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
          {/* TODO implementar loading final da lista  */}
        </Popover>
      </div>
    </div>
  );
}


