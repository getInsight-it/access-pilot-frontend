import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'

type Notification = {
  id: number
  title: string
  message: string
  date: string
}

type NotificationListProps = {
  notifications: Notification[]
  onSelectNotification: (notification: Notification) => void
  selectedNotification: Notification | null
}

export default function NotificationList({ notifications, onSelectNotification, selectedNotification }: NotificationListProps) {
  return (
    <Card className="">
      {/* <CardHeader>
        <CardTitle>Lista de Notificações</CardTitle>
      </CardHeader> */}
      <CardContent className="p-4">
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer ${selectedNotification?.id === notification.id ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => onSelectNotification(notification)}
              >
                <CardHeader>
                  <CardTitle className="text-sm">{notification.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">{notification.date}</p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

