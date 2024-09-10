import { useState, useEffect } from 'react'
import { useTheme } from './ThemeToggle/theme-provider' // Usando o contexto customizado

function ThemedLogo() {
  const { theme } = useTheme() // Usando o contexto customizado
  const [src, setSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

  useEffect(() => {
    switch (theme) {
      case 'light':
        setSrc('/accesspilot.svg')
        break
      case 'dark':
        setSrc('/accesspilot-w.svg')
        break
      case 'tangerine':
        setSrc('/accesspilot.svg')
        break
      case 'rnp':
        setSrc('/rnp.png')
        break
      default:
        setSrc('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        break
    }
  }, [theme])

  return (
    <img
      className="mx-2 h-20 w-60 block"
      src={src}
      alt="Logo"
    />
  )
}

export default ThemedLogo
