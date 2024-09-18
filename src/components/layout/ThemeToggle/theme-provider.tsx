import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (_theme: string) => {}
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    setTheme(savedTheme)
  }, [])

  const changeTheme = (newTheme: string) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
