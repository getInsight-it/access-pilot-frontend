import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from 'lucide-react'
import { Button } from "../../components/ui/button"

export default function Stepper() {
  const steps = [
    "Qual o sistema você quer acesso?",
    "E qual o seu papel",
    "Descreva o motivo"
  ]
  const [currentStep, setCurrentStep] = useState(1)
  const [complete, setComplete] = useState(false)

  const handleNext = () => {
    if (currentStep === steps.length) {
      setComplete(true)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="flex justify-between w-full max-w-md">
        {steps.map((step, i) => (
          <div
            key={i}
            className="step-item relative flex flex-col items-center w-36"
          >
            {i !== 0 && (
              <div className="absolute w-full h-[3px] right-1/2 top-5">
                <div className="w-full h-full bg-slate-200" />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-green-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: currentStep > i ? '100%' : 0,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            <motion.div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white
                ${currentStep === i + 1 ? "bg-sky-600" : 
                  (i + 1 < currentStep || complete) ? "bg-green-600" : "bg-slate-700"}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {i + 1 < currentStep || complete ? (
                <Check size={24} />
              ) : (
                i + 1
              )}
            </motion.div>
            <p className="text-sm mt-2 text-center">
              {step}
            </p>
          </div>
        ))}
      </div>
      {!complete && (
        <div className="flex space-x-4">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
          >
            Voltar
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length ? "Finalizar" : "Próximo"}
          </Button>
        </div>
      )}
    </div>
  )
}

