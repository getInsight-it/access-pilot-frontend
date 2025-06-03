import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore.ts";
import { catchError, from, tap } from "rxjs";

import { Breadcrumbs } from "../../components/breadcrumbs.tsx";
import { Heading } from "../../common/components/header/heading.tsx";
import { Separator } from "../../components/ui/separator.tsx";
import { motion } from "framer-motion";

import NotificationList from "../../components/notifications/NotificationList.tsx";
import NotificationDetails from "../../components/notifications/NotificationDetails.tsx";
import { notificationService } from "../../common/service/notification-service.ts";

type Notification = {
  id: number
  title: string
  description: string
  date: string
}

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Notificações", link: "" }
];

export default function NotificationsPage() {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const init = () => {
    getData();
  };

  useEffect(() => {
    if(isAuthenticated) {
      init();
    }
  }, [isAuthenticated], useAuthStore?.getState()?.user?.id);

  const getData = async () => {
    if(!useAuthStore?.getState()?.user?.id) {
      return;
    }
    from(notificationService.getNotifications("WEB", 1, 10000, "id", "DESC", useAuthStore?.getState()?.user?.id)).pipe(
      tap((response) => {
        setNotifications(response?.items || []);
      }), catchError((error) => {
          console.error(error);
          return [];
        }
      )).subscribe();
  };

  const handleNotificationClick = (notification) => {
    from(notificationService.updateOpenNotification(notification.id, true)).pipe(
      tap((response) => {
        getData();
        setSelectedNotification(notification);
      }), catchError((error) => {
          console.error(error);
          return [];
        }
      )).subscribe();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
      }}
      className="flex-1 space-y-4 p-4 pt-6 md:p-8">

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading title={`Notificações`} description="" />
      </div>

      <Separator className="" />

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            <NotificationList
              notifications={notifications}
              onSelectNotification={(notification) => handleNotificationClick(notification)}
              selectedNotification={selectedNotification} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            <NotificationDetails notification={selectedNotification} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
