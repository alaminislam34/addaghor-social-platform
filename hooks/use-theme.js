"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("addaghor-theme") || "light"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "secondary-theme")

    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "secondary") {
      root.classList.add("secondary-theme")
    }
  }

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem("addaghor-theme", newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
