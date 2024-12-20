import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'

type Notification = {
  id: number
  title: string
  message: string
  date: string
}

type NotificationDetailsProps = {
  notification: Notification | null
}

export default function NotificationDetails({ notification }: NotificationDetailsProps) {
  if (!notification) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-gray-500">Selecione uma notificação para ver os detalhes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{notification.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{notification.message}</p>
          <p className="text-sm text-gray-500">Data: {notification.date}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

