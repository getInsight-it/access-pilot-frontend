import { useState, useEffect } from 'react'
import { useTheme } from '../../theme/theme-provider.tsx'

export const Logo = () => {
  const { theme } = useTheme()
  const [src, setSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

  useEffect(() => {
    switch (theme) {
      case 'light':
        setSrc('/img/getinsight-dark.svg')
        break
      case 'dark':
        setSrc('/img/getinsight-light.svg')
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
      className="w-60 lg:w-60"
      src={src}
      alt="Logo"
    />
  )
}
