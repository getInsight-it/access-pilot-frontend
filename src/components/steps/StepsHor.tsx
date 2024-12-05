import { animate, Variants, motion, useAnimationControls } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react'
import { Check } from 'lucide-react';

type Props = {
  children?: ReactNode;
  steps: ReactNode[];
  onStepChange?: (step: number) => void;
  onSubmit?: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: boolean[];
  invalidSteps: boolean[];
  onStepClick: (step: number) => void;
}

export default function Steps({ 
  children, 
  steps, 
  onStepChange, 
  onSubmit, 
  currentStep, 
  setCurrentStep, 
  completedSteps, 
  invalidSteps,
  onStepClick 
}: Props) {
  const prevButtonAnimControls = useAnimationControls();
  const progressBarAnimControls = useAnimationControls();

  const prevButtonVariants: Variants = {
    initial: {x: '-100%', opacity: 0},
    animate: {x: 0, opacity: 1}
  }

  const progressBarVariants: Variants = {
    initial: {width: `${100/steps.length}%`},
    animate: {width: `${((currentStep + 1) / steps.length) * 100}%`},
  }

  useEffect(() => {
    progressBarAnimControls.start("animate");
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, progressBarAnimControls, steps.length, onStepChange])

  useEffect(() => {
    if (currentStep > 0) {
      prevButtonAnimControls.start("animate");
    }
  }, [currentStep, prevButtonAnimControls])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    // Apenas muda o passo atual, sem submeter o formulário
    setCurrentStep(index);
  };

  return (
    <motion.div
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }}
      layout
      className="bg-white border-2 border-primary rounded-xl text-black w-full "
    >

      <div className="flex justify-center gap-5 mt-10 mb-6">
        <div className="relative grid grid-cols-5 py-1">
          <motion.div
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.3
            }}
            animate={progressBarAnimControls}
            variants={progressBarVariants}
            initial="initial"
            className="absolute rounded-full top-0 left-0 h-full w-full bg-gray-300"
          />
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleStepClick(index);
              }}
              className={`h-12 w-12 rounded-full mx-14 z-10 flex items-center justify-center 
                ${index <= currentStep ? "bg-white" : "bg-gray-300"}
                ${invalidSteps[index] ? "border-2 border-red-500" : ""}
                ${completedSteps[index] ? "border-2 border-green-500" : ""}
                cursor-pointer hover:bg-gray-100
                transition-colors duration-200
              `}
            >
              {completedSteps[index] ? (
                <Check className="text-green-500" size={24} />
              ) : (
                <span className={invalidSteps[index] ? "text-red-500" : ""}>{index + 1}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {children}
      <div className="min-h-[270px]">
        {steps[currentStep]}
      </div>
      
      <div className="flex gap-2 mt-7 overflow-hidden text-base">
        {currentStep > 0 && (
          <motion.button
            variants={prevButtonVariants}
            animate={prevButtonAnimControls}
            initial="initial"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-black"
            onClick={handlePrev}
            type="button"
          >
            Voltar
          </motion.button>
        )}
        <motion.button
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.3
          }}
          className="gap-2 px-4 py-2 bg-primary hover:bg-[var(--button-hover)] transition-colors text-white rounded-full flex-grow"
          onClick={handleNext}
          type="button"
          layout
        >
          {currentStep === steps.length - 1 ? 'Enviar' : 'Próximo'}
        </motion.button>
      </div>
    </motion.div>
  )
}
















