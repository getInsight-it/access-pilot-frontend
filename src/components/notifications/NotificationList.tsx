import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

type Notification = {
  id: number
  title: string
  description: string
  date: string
  isOpened: boolean
}

type NotificationListProps = {
  notifications: Notification[]
  onSelectNotification: (notification: Notification) => void
  selectedNotification: Notification | null
}

export default function NotificationList({ notifications, onSelectNotification, selectedNotification }: NotificationListProps) {
  console.log(notifications)
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
                className={`cursor-pointer flex items-center justify-between ${selectedNotification?.id === notification.id ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => onSelectNotification(notification)}
              >
                <CardHeader>
                  <CardTitle className="text-sm">
                    {notification.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  {!notification.isOpened && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 block" aria-hidden="true" />

                  )}
                  {notification.isOpened && (
                    <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  )}
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

