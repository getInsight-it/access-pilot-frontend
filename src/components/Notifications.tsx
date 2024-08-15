'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useOutsideClick } from '@/hooks/use-outside-click' // Ajuste o caminho do import do seu hook

const variants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
}

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null) // Defina o tipo da referência como HTMLDivElement
    const buttonRef = useRef<HTMLDivElement>(null) // Defina o tipo da referência como HTMLDivElement

    useOutsideClick(dropdownRef, (event: MouseEvent) => {
        if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
            // Se o clique for no botão, não fechar o dropdown
            return;
        }
        setIsOpen(false)
    })

    return (
        <>
            <div className="relative mr-2">
                <motion.div
                    ref={buttonRef} // Adicionei a referência ao botão
                    whileTap={{ opacity: 0.5 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                    bg-black
                    text-white
                    dark:bg-white
                    dark:text-black
                    rounded-full
                    w-8
                    h-8
                    grid
                    items-center
                    justify-center
                    text-center
                    text-gray500
                    hover:text-gray400
                    cursor-pointer duration-100 ease-in-out
                    ">
                    <a className="leading-6 font-medium">
                        <Bell className="h-5 w-5" />
                    </a>
                </motion.div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={dropdownRef} // Adicionei a referência ao dropdown
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1 }}
                            transition={{ type: 'spring' }}
                            className="
                                        z-10
                                        py-4
                                        px-6
                                        w-80
                                        bg-white
                                        dark:bg-black
                                        border
                                        shadow-lg
                                        rounded-xl
                                        absolute
                                        top-12
                                        right-0
                                        flex
                                        flex-col
                                        ">
                            <div className="text-left">
                                <div className="flex items-center">
                                    <p className="mr-3 text-md font-medium text-gray-600 dark:text-gray-400">
                                        Notificações
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="">
                                        <p className="font-medium text-sm">
                                            Nova solicitação de acesso.
                                        </p>
                                    </div>
                                    <small className="text-gray500 font-normal text-xs">22/06/2024</small>
                                </div>

                                <div className="flex justify-between my-6 items-center">
                                    <div className="">
                                        <p className="font-medium text-sm">
                                            Solicitação XYZ123456 atualizada.
                                        </p>
                                    </div>
                                    <small className="text-gray500 font-normal text-xs">22/06/2024</small>
                                </div>

                                <div className="flex justify-between mt-4 items-center">
                                    <div className="">
                                        <p className="font-medium text-sm">
                                            Nova solicitação.
                                        </p>
                                    </div>
                                    <small className="text-gray500 font-normal text-xs">22/06/2024</small>
                                </div>

                                <div className="flex justify-between mt-8 mb-4 items-center">
                                    <button className="
                                                      font-medium
                                                      text-sm
                                                      text-blue
                                                      hover:text-gray500
                                                      absolute
                                                      ">
                                        Ver todas
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
