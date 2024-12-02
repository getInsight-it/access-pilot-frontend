import { Variants, motion, useAnimationControls } from 'framer-motion';
import { ReactNode, useEffect } from 'react'
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
  stepLabels: string[];
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
  onStepClick,
  stepLabels
}: Props) {
  const prevButtonAnimControls = useAnimationControls();
  const progressBarAnimControls = useAnimationControls();

  const prevButtonVariants: Variants = {
    initial: {x: '-100%', opacity: 0},
    animate: {x: 0, opacity: 1}
  }

  const progressBarVariants: Variants = {
    initial: { height: '0%', opacity: 0 },
    animate: { 
      height: `${Math.min(((currentStep) / (steps.length - 1)) * 100, 100)}%`,
      opacity: 1,
      transition: {
        height: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    },
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
    onStepClick(index);
  };

  const getStepStyle = (index: number) => {
    if (completedSteps[index]) {
      return "bg-white border-2 border-green-500";
    } else if (invalidSteps[index]) {
      return "bg-white border-2 border-red-500";
    } else if (index === currentStep) {
      return "bg-primary border-2 border-primary";
    } else {
      return "bg-gray-100 border-2 border-primary";
    }
  };

  const getProgressBarColor = () => {
    if (invalidSteps[currentStep]) {
      return "bg-red-500";
    } else if (completedSteps[currentStep]) {
      return "bg-green-300";
    } else {
      return "bg-primary";
    }
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
      className="w-full flex mt-12"
    >
      <div className="absolute flex flex-col justify-center gap-5 mr-6">
        <div className="relative flex flex-col items-center py-1">
          <span className="absolute rounded-full top-[15px] right-[26px] w-1 h-60 bg-gray-200 origin-top"></span>
          <motion.div
            animate={progressBarAnimControls}
            variants={progressBarVariants}
            initial="initial"
            className={`absolute rounded-full top-[6px] right-[26px] w-1 origin-top ${getProgressBarColor()}`}
            style={{
              height: `${Math.min(((currentStep) / (steps.length - 1)) * 100, 100)}%`,
              maxHeight: `calc(100% - ${steps.length * 43}px)`,
              bottom: '7px'
            }}
          />
          {steps.map((_, index) => (
            <div key={index} className="flex items-center mb-16">
              <span className="w-24 text-sm font-medium text-right mr-8">{stepLabels[index]}</span>
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  handleStepClick(index);
                }}
                className={`h-14 w-14 rounded-full z-10 flex items-center justify-center 
                  ${getStepStyle(index)}
                  cursor-pointer hover:bg-gray-200
                  transition-colors duration-200
                `}
                whileTap={{ scale: 0.95 }}
              >
                {completedSteps[index] ? (
                  <Check className="text-green-500" size={24} />
                ) : (
                  <span className={
                    invalidSteps[index] 
                      ? "text-red-500" 
                      : index === currentStep
                        ? "text-white"
                        : "text-primary"
                  }>
                    {index + 1}
                  </span>
                )}
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="flex-1 max-w-lg">
        {children}
        <div className="ml-56">
            {steps[currentStep]}
        </div>

        <div className="flex gap-2 mt-8 overflow-hidden text-base">
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
      </div> */}
      
      <div className="flex-1 max-w-xl">
        {children}
        
        <div className="ml-56">
            {steps[currentStep]}
        </div>

        <div className="max-w-[320px] flex gap-2 mt-40 overflow-hidden text-base">
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
      </div>

    </motion.div>
  )
}

