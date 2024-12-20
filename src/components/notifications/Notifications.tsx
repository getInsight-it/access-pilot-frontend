import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Link } from 'react-router-dom';
import { PilotMessages } from './PilotMessages';

// Custom hook for handling outside clicks
function useOutsideClick(ref: React.RefObject<HTMLElement>, buttonRef: React.RefObject<HTMLElement>, callback: () => void) {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, buttonRef, callback]);
}

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState('front')
    const [unreadCount, setUnreadCount] = useState(3) // Contador de notificações não lidas
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useOutsideClick(dropdownRef, buttonRef, () => {
        setIsOpen(false);
    })

    const handleOpenNotifications = () => {
        setIsOpen((prevState) => !prevState);
        if (unreadCount > 0) {
            setUnreadCount(0); // Zera o contador ao abrir as notificações
        }
    }

    const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        const position = (x / width) * 100;
        
        if (position < 33) {
            setCurrentImage('left');
        } else if (position > 66) {
            setCurrentImage('right');
        } else {
            setCurrentImage('front');
        }
    }

    const handleImageMouseLeave = () => {
        setCurrentImage('front');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleOpenNotifications();
        }
    }

    return (
        <div className="flex items-center space-x-4">
            {/* {unreadCount > 0 && (
            <>
                <div 
                    ref={imageRef}
                    className="w-[60px] h-[60px] bg-red-500 absolute -ml-10 mt-16 cursor-pointer overflow-hidden rounded-full border-2 border-black shadow-xl"
                    onMouseMove={handleImageMouseMove}
                    onMouseLeave={handleImageMouseLeave}
                >
                    <img
                        src={`/render/${currentImage}.jpg`}
                        alt="Profile avatar"
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(${currentImage === 'left' ? '10%' : currentImage === 'right' ? '-10%' : '0'})` }}
                    />
                </div>
                <PilotMessages />
            </>
            )} */}
            <div className="relative">
                <motion.button
                    ref={buttonRef}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenNotifications}
                    onKeyDown={handleKeyDown}
                    className="
                    relative
                    bg-gray-800
                    text-white
                    dark:bg-white
                    dark:text-gray-800
                    rounded-full
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    transition-colors
                    duration-200
                    hover:bg-gray-700
                    dark:hover:bg-gray-200
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-blue-500
                    "
                    aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Bell className="h-5 w-5" />
                    )}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="
                            z-50
                            py-4
                            px-6
                            w-80
                            bg-white
                            dark:bg-gray-800
                            border
                            border-gray-200
                            dark:border-gray-700
                            shadow-lg
                            rounded-xl
                            absolute
                            top-12
                            right-0
                            flex
                            flex-col
                            "
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="notifications-menu"
                        >
                            <div className="text-left">
                                <div className="flex items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Notificações
                                    </h3>
                                </div>

                                {[
                                    { text: "Nova solicitação de acesso.", date: "22/06/2024" },
                                    { text: "Solicitação XYZ123456 atualizada.", date: "21/06/2024" },
                                    { text: "Nova solicitação.", date: "20/06/2024" },
                                ].map((notification, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex justify-between items-center ${index !== 0 ? 'mt-4' : ''} pb-4 ${index !== 2 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                                        role="menuitem"
                                        tabIndex={0}
                                    >
                                        <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            {notification.text}
                                        </p>
                                        <small className="text-gray-500 dark:text-gray-400 font-normal text-xs">{notification.date}</small>
                                    </div>
                                ))}

                                <div className="mt-6 text-right">
                                    <Link
                                      onClick={handleOpenNotifications}
                                      to="/dashboard/notifications"
                                      className="
                                      font-medium
                                      text-sm
                                      text-blue-600
                                      hover:text-blue-800
                                      dark:text-blue-400
                                      dark:hover:text-blue-300
                                      transition-colors
                                      duration-200
                                      focus:outline-none
                                      focus:underline
                                      "
                                      role="menuitem">
                                        Ver todas
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

