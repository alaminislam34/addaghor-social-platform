"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { currentUser } from "@/data/mock-users"

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const isLoggedIn = localStorage.getItem("addaghor-logged-in") === "true"
      if (isLoggedIn) {
        setUser(currentUser)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Mock validation
    if (!email || !password) {
      throw new Error("Please enter email and password")
    }
    localStorage.setItem("addaghor-logged-in", "true")
    setUser(currentUser)
    return currentUser
  }

  const register = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (!data.email || !data.password || !data.name) {
      throw new Error("Please fill in all required fields")
    }
    localStorage.setItem("addaghor-logged-in", "true")
    setUser(currentUser)
    return currentUser
  }

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    localStorage.removeItem("addaghor-logged-in")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
