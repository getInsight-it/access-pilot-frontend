// const CompactCalendar = () => {
//     // Mês e ano fixos para o exemplo
//     const currentMonth = "Maio"
//     const currentYear = 2025
  
//     // Data selecionada para o exemplo
//     const selectedDate = 6
  
//     // Array com os dias da semana
//     const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
//     // Array com os dias do mês (simplificado para 31 dias)
//     const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  
//     return (
//       <div className="max-w-xs bg-white border rounded-[var(--card-border-radius)] overflow-hidden">
//         <div className="text-left p-2 border-b">
//           <h2 className="font-bold text-sm text-gray-800">{currentMonth} {currentYear}</h2>
//         </div>
//         <div className="grid grid-cols-7 gap-0.5 p-2">
//           {weekDays.map((day) => (
//             <div key={day} className="text-left px-2 font-medium text-xs text-gray-600 py-1 bg-gray-100">
//               {day[0]}
//             </div>
//           ))}
//           {daysInMonth.map((day) => (
//             <div
//               key={day}
//               className={`text-center p-1 w-7 h-7 text-sm ${
//                 day === selectedDate
//                   ? 'bg-blue-500 text-white font-semibold rounded-full'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               {day}
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }
  
//   export default CompactCalendar

import React from 'react'
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from 'lucide-react'

interface CompactCalendarProps {
  initialDate: string
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({ initialDate }) => {
  const getValidDate = (dateString: string): Date => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date())
      return isValid(parsedDate) ? parsedDate : new Date()
    } catch {
      return new Date()
    }
  }

  const date = getValidDate(initialDate)
  const currentMonth = format(date, 'MMMM', { locale: ptBR })
  const currentYear = format(date, 'yyyy')
  
  const selectedDate = parseInt(format(date, 'd'))
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const startDate = startOfMonth(date)
  const endDate = endOfMonth(date)
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })
  
  const firstDayOfMonth = startDate.getDay()
  const emptyDays = Array(firstDayOfMonth).fill(null)

  return (
    <div className="max-w-xs bg-white border rounded-[var(--card-border-radius)] overflow-hidden">
      <div className="text-left p-2 border-b flex items-center justify-between">
        <h2 className="font-bold text-sm text-gray-800 capitalize">{currentMonth} {currentYear}</h2>
        <Calendar className="w-5 h-5" />
      </div>
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {weekDays.map((day) => (
          <div key={day} className="text-left px-2 font-medium text-xs text-gray-600 py-1 bg-gray-100">
            {day[0]}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="text-center p-1 w-7 h-7"></div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day.getTime()}
            className={`text-center p-1 w-7 h-7 text-sm ${
              isSameDay(day, date)
                ? 'bg-blue-500 text-white font-semibold rounded-full'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompactCalendar

