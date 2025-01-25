import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { format } from 'date-fns'

type Notification = {
  id: number
  title: string
  description: string
  ultimaAlteracao: string
}

type NotificationDetailsProps = {
  notification: Notification | null
}

export default function NotificationDetails({ notification }: NotificationDetailsProps) {

  const formattedDate = notification ? format(new Date(notification.ultimaAlteracao), 'dd/MM/yyyy - HH:mm') : '';

  if (!notification) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center h-96'>
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
          <p className="mb-2">{notification.description}</p>
          <p className="text-sm text-gray-500">
            Data: {formattedDate}
            {/* Data: {notification.ultimaAlteracao} */}
          </p>
          
        </CardContent>
      </Card>
    </motion.div>
  )
}

