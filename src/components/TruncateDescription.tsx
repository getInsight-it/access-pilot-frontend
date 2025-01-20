import React, { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

interface TruncatedDescriptionProps {
  description: string | undefined | null
  maxLength?: number
  fallback?: string
  fontSize?: string
}

export function TruncatedDescription({
  description,
  maxLength = 100,
  fallback = "No description available",
  fontSize = "text-sm",
}: TruncatedDescriptionProps) {
  const [truncatedDescription, setTruncatedDescription] = useState<string>(fallback)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (description) {
      if (description.length > maxLength) {
        setTruncatedDescription(description.slice(0, maxLength - 16) + "...")
        setShowTooltip(true)
      } else {
        setTruncatedDescription(description)
        setShowTooltip(false)
      }
    } else {
      setTruncatedDescription(fallback)
      setShowTooltip(false)
    }
  }, [description, maxLength, fallback])

  if (!description) {
    return <p className={`mt-1 ${fontSize}`}>{fallback}</p>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="">
          <p className={`mt-1 ${fontSize}`}>{truncatedDescription}</p>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent className="rounded-[var(--card-border-radius)]">
            <p className="max-w-xs">{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

