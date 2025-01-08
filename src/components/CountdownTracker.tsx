import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { Card, CardContent } from "../components/ui/card"
import { motion } from 'framer-motion'

export default function CountdownTracker() {
  const [activeCircle, setActiveCircle] = useState(0)
  const totalDays = 31
  const passedDays = 13

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCircle((prev) => (prev + 1) % (passedDays + 1)) // 0 to 13, then back to 0
    }, 500) // Change circle every 500ms

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-[220px] bg-gray-50/50 rounded-3xl">
      <CardContent className="p-6 flex flex-col space-y-4">
        <div className="bg-white rounded-full w-fit">
          <Clock className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="text-left">
          <h2 className="text-2xl font-semibold">Ha 13 Dias</h2>
          <p className="text-sm text-gray-600">109 horas, 23 minutos</p>
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {[...Array(totalDays)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < passedDays ? "bg-red-500" : "bg-gray-200"
              } ${i === 30 ? "col-start-1" : ""}`}
              animate={{
                scale: i === activeCircle && i < passedDays ? [1, 1.5, 1] : 1,
                opacity: i === activeCircle && i < passedDays ? [1, 0.5, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

