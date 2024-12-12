import { useState, useEffect } from 'react'
import { useTheme } from './ThemeToggle/theme-provider' // Usando o contexto customizado

function ThemedLogo() {
  const { theme } = useTheme() // Usando o contexto customizado
  const [src, setSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

  useEffect(() => {
    switch (theme) {
      case 'light':
        setSrc('/img/accesspilot.svg')
        break
      case 'dark':
        setSrc('/img/accesspilot-w.svg')
        break
      case 'tangerine':
        setSrc('/img/accesspilot.svg')
        break
      case 'rnp':
        setSrc('/img/rnp.png')
        break
      case 'gov':
        setSrc('/govbr/logo.svg')
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
