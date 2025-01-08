'use client'

import { useState } from 'react'
import { Copy, Check, Barcode } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { CardShine } from './CardShine'

interface CopyProtocolProps {
  protocol: string
}

export function CopyProtocol({ protocol }: CopyProtocolProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(protocol)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg">Protocolo:</p>
      
        <div className="flex flex-col pt-4 pb-4 pl-4 transition-all border rounded-[var(--card-border-radius)]">
          <div className="flex items-center text-xs xl:text-sm  truncate">
            {/* <Barcode className="w-5 h-5 mr-4" /> */}
            {protocol}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={handleCopy}
                    className="text-gray-500 cursor-pointer ml-2"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary" />
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{isCopied ? 'Copiado!' : 'Copiar protocolo'}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
    </div>
  )
}

