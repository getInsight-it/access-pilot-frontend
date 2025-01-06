'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

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
    <div className="w-full mt-6">
      <p className="font-bold mb-1">Protocolo:</p>
      <div className="flex items-center">
        {protocol}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={handleCopy}
                className="text-gray-500 cursor-pointer ml-2"
              >
                {isCopied ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <Copy className="w-6 h-6 text-primary" />
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
  )
}

