import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, SquareArrowOutUpRight } from "lucide-react";
import { PRIVATE_ROUTES } from "@common/constants/routes";
import { useAuth } from "@common/context/auth/AuthContext";
import { Button } from "@common/external/ui/button";
import { toast } from "@common/external/ui/use-toast";
import { notificationService } from "@common/service/notification-service";
import { NotificationModel } from "@common/types/notification/notification.model";
import { formatErrorMessages } from "@common/utils/error-utils";
import { savePreviousRoute } from "@common/utils/NavigationStateManager";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@common/external/ui/popover";
import { Separator } from "@common/external/ui/separator";
import { get } from "react-hook-form";


export default function Notifications() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const authData = useAuth();
  const pageSize = 80;

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
    if(!authData || !authData.user) return;

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
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao buscar notificações.",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getAvailableActions = async (notification: NotificationModel) => {
    let actions: string[] = [];
    
    actions = await notificationService.getAvailableActions(notification.requestId);
    console.log('ACTIONS AEEEEE', actions);
    
    
    return actions;
  }

  return (
    <div className="flex items-center">
      <div>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all text-default" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[480px] p-0 max-h-[70vh] sm:max-h-[60vh] flex flex-col z-[100]" align="end">
            <header className="flex flex-row justify-between items-center p-3 sm:p-4 gap-2">
              <h4 className="text-base sm:text-lg font-semibold">Notificações</h4>
              <div className="flex flex-row gap-1 items-center cursor-pointer flex-shrink-0">
                <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="hidden sm:inline text-xs sm:text-sm text-blue-500 whitespace-nowrap">Marcar todas como lido</span>
                <span className="sm:hidden text-xs text-blue-500 whitespace-nowrap">Marcar lidas</span>
              </div>
            </header>
            <Separator />
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => (
                <div className="flex flex-row justify-between items-center gap-2 p-3 sm:p-4 border-b border-gray-100" key={notification.id}>
                  <p className="text-sm sm:text-base break-words min-w-0 flex-1">{notification.title}</p>
                  <div className="flex flex-row gap-2 flex-shrink-0">
                    {notification.isOpened
                      ? <CheckCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      : <Check className="h-4 w-4 text-gray-400 cursor-pointer flex-shrink-0" />
                    }
                    <SquareArrowOutUpRight
                      className="h-4 w-4 text-blue-500 cursor-pointer flex-shrink-0"
                      onClick={async () => {
                        setIsOpen(false);
                        let availableActions = await getAvailableActions(notification);
                        savePreviousRoute(PRIVATE_ROUTES.ACCESS_REQUESTS, availableActions.includes('REJECT') ? "assigned" : "created");
                        navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", notification.requestId.toString()));
                      }}
                    />
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