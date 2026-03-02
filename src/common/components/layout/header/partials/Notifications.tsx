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

    return actions;
  }

  return (
    <div>
      <div>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <header>
              <h4>Notificações</h4>
              <div>
                <CheckCheck />
                <span>Marcar todas como lido</span>
                <span>Marcar lidas</span>
              </div>
            </header>
            <Separator />
            <div>
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <p>{notification.title}</p>
                  <div>
                    {notification.isOpened
                      ? <CheckCheck />
                      : <Check />
                    }
                    <SquareArrowOutUpRight
                      onClick={async () => {
                        setIsOpen(false);
                        const availableActions = await getAvailableActions(notification);
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
