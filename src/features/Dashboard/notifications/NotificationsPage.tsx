import { useState } from 'react'
import { motion } from 'framer-motion'
import NotificationList from '../../../components/notifications/NotificationList'
import NotificationDetails from '../../../components/notifications/NotificationDetails'

type Notification = {
  id: number
  title: string
  message: string
  date: string
}

const notifications: Notification[] = [
  { id: 1, title: 'Nova mensagem', message: 'Você recebeu uma nova mensagem de João.', date: '2023-05-20' },
  { id: 2, title: 'Lembrete', message: 'Reunião às 14h hoje.', date: '2023-05-20' },
  { id: 3, title: 'Atualização', message: 'Nova versão do aplicativo disponível.', date: '2023-05-19' },
]

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  return (
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
            onSelectNotification={setSelectedNotification}
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
  )
}
