'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

function ThemedLogo() {
  const { resolvedTheme } = useTheme()
  const [src, setSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

  useEffect(() => {
    switch (resolvedTheme) {
      case 'light':
        setSrc('/accesspilot.svg')
        break
      case 'dark':
        setSrc('/accesspilot-w.svg')
        break
      case 'tangerine':
        setSrc('/accesspilot-w.svg')
        break
        case 'rnp':
        setSrc('/rnp.png')
        break
      default:
        setSrc('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        break
    }
  }, [resolvedTheme])

  return (
    <Image
      className="mx-2 h-20 w-60 block"
      src={src}
      width={400}
      height={400}
      alt="Logo"
      loading="lazy"
    />
  )
}

export default ThemedLogo
