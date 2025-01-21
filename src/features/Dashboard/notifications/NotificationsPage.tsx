// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import NotificationList from '../../../components/notifications/NotificationList'
// import NotificationDetails from '../../../components/notifications/NotificationDetails'

// type Notification = {
//   id: number
//   title: string
//   message: string
//   date: string
// }

// const notifications: Notification[] = [
//   { id: 1, title: 'Nova mensagem', message: 'Você recebeu uma nova mensagem de João.', date: '2023-05-20' },
//   { id: 2, title: 'Lembrete', message: 'Reunião às 14h hoje.', date: '2023-05-20' },
//   { id: 3, title: 'Atualização', message: 'Nova versão do aplicativo disponível.', date: '2023-05-19' },
// ]

// export default function NotificationsPage() {
//   const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

//   return (
//     <div className="container p-4 mt-8 md:p-8">
//       <h1 className="text-2xl font-bold mb-4">Notificações</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <motion.div
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <NotificationList
//             notifications={notifications}
//             onSelectNotification={setSelectedNotification}
//             selectedNotification={selectedNotification}
//           />
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <NotificationDetails notification={selectedNotification} />
//         </motion.div>
//       </div>
//     </div>
//   )
// }



import {useEffect, useState} from "react";

import {useNavigate, useParams} from "react-router-dom";
import useAuthStore from "../../../store/authStore.ts";
import {catchError, filter, from, interval, startWith, switchMap, tap} from "rxjs";

import { Breadcrumbs } from '../../../components/breadcrumbs';
import { Heading } from '../../../components/ui/heading';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from "../../../components/ui/separator.tsx";
import { motion } from 'framer-motion'


import NotificationList from '../../../components/notifications/NotificationList'
import NotificationDetails from '../../../components/notifications/NotificationDetails'
import {notificationService} from "../../../services/notification";
import {NotificationDto} from "../../../services/notification/notification-dto.ts";
import {ClientDTO} from "../../../services/client/client-dto.ts";

type Notification = {
  id: number
  title: string
  description: string
  date: string
}

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Notificações', link: '' }
];


export default function NotificationsPage() {

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const [data, setData] = useState<ClientDTO>();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const init = () => {
    getData();
  };

  useEffect(() => {
    if (isAuthenticated) {
      init()
    }
  }, [isAuthenticated], useAuthStore?.getState()?.user?.id);

  const getData = async () => {
    if (!useAuthStore?.getState()?.user?.id) {
      return;
    }
    from(notificationService.getNotifications('WEB', 1, 10000, 'id','DESC', useAuthStore?.getState()?.user?.id)).pipe(
      tap((response) => {
        setNotifications(response?.items || [])
      }),catchError((error) => {
        console.error(error);
        return [];
      }
    )).subscribe();
  };

  const handleNotificationClick = (notification) => {
    from(notificationService.updateOpenNotification(notification.id, true)).pipe(
      tap((response) => {
        getData();
        setSelectedNotification(notification)
      }),catchError((error) => {
        console.error(error);
        return [];
      }
    )).subscribe();
  }

  return (
    <ScrollArea className="h-full ">

      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8"
      >

        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Notificações`}
            description=""
          />
        </div>

        <Separator className="" />

        <div className="container p-4 mt-8 md:p-8">
          <h1 className="text-2xl font-bold mb-4">Notificações</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NotificationList
                notifications={notifications}
                onSelectNotification={(notification) => handleNotificationClick(notification)}
                selectedNotification={selectedNotification}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NotificationDetails notification={selectedNotification} />
            </motion.div>
          </div>
        </div>

      </motion.div>

    </ScrollArea>
  );
}
