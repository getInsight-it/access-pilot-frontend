import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Check, CheckCheck, SquareArrowOutUpRight } from "lucide-react";
import { PRIVATE_ROUTES } from "@common/constants/routes";
import { useAuth } from "@common/context/auth/AuthContext";
import { Button } from "@common/external/ui/button";
import { toast } from "@common/external/ui/use-toast";
import { notificationService } from "@common/service/notification-service";
import { NotificationModel } from "@common/types/notification/notification.model";
import { formatErrorMessages } from "@common/utils/error-utils";
import { savePreviousRoute } from "@common/utils/NavigationStateManager";
import { useI18n } from "@common/context/i18n/I18nContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@common/external/ui/popover";
import "./notifications.scss";

export default function Notifications() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const authData = useAuth();
  const pageSize = 80;
  const { t } = useI18n();

  const loadNotifications = useCallback(async () => {
    if(!authData || !authData.user) {
      return;
    }

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
        title: t("Erro ao buscar notificações."),
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [authData, notifications, page, pageSize, t]);

  useEffect(() => {
    if(isOpen && authData && hasMoreItems) {
      loadNotifications();
    }
  }, [authData, hasMoreItems, isOpen, loadNotifications]);

  useEffect(() => {
    if(!isOpen) {
      setPage(1);
      setNotifications([]);
      setHasMoreItems(true);
    }
  }, [isOpen]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isOpened).length,
    [notifications]
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleOpenNotification = async (notification: NotificationModel) => {
    setIsOpen(false);
    const availableActions = await notificationService.getAvailableActions(notification.requestId);

    savePreviousRoute(
      PRIVATE_ROUTES.ACCESS_REQUESTS,
      availableActions.includes("REJECT") ? "assigned" : "created"
    );

    navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", notification.requestId.toString()));
  };

  return (
    <div className="notifications">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="white" size="icon" className="notifications__trigger" aria-label={t("Notificações")}>
            <Bell className="notifications__trigger-icon" />
            {unreadCount > 0 && (
              <span className="notifications__badge">{unreadCount}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="notifications__panel">
          <header className="notifications__header">
            <h4 className="notifications__title">{t("Notificações")}</h4>
            <p className="notifications__subtitle">{t("{{count}} não lidas", { count: unreadCount })}</p>
          </header>
          <div className="notifications__divider" />
          <div className="notifications__list">
            {notifications.length === 0 && (
              <p className="notifications__empty">{t("Sem notificações no momento.")}</p>
            )}
            {notifications.map((notification) => (
              <article className="notifications__item" key={notification.id}>
                <p className="notifications__item-title">{notification.title}</p>
                <div className="notifications__item-actions">
                  {notification.isOpened ? (
                    <CheckCheck className="notifications__item-status" />
                  ) : (
                    <Check className="notifications__item-status" />
                  )}
                  <button
                    type="button"
                    className="notifications__item-open"
                    onClick={() => handleOpenNotification(notification)}
                    aria-label={t("Abrir notificação")}
                  >
                    <SquareArrowOutUpRight className="notifications__item-open-icon" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
