"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Settings, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials, formatDate, cn } from "@/lib/utils"
import { getNotifications, markNotificationRead } from "@/lib/api"

const notificationIcons = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  friend_request: { icon: UserPlus, color: "text-green-500", bg: "bg-green-500/10" },
  follow: { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" },
  mention: { icon: AtSign, color: "text-yellow-500", bg: "bg-yellow-500/10" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const filteredNotifications = filter === "all" ? notifications : notifications.filter((n) => !n.read)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <p className="text-muted-foreground">{unreadCount} unread notifications</p>}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-2">
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Link href="/settings/notifications">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Button variant={filter === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "unread" ? "secondary" : "ghost"} size="sm" onClick={() => setFilter("unread")}>
          Unread
        </Button>
      </div>

      {/* Notifications list */}
      <div className="bg-card rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => {
              const iconConfig = notificationIcons[notification.type] || notificationIcons.like
              const Icon = iconConfig.icon

              return (
                <button
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 text-left hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={notification.user?.avatar || "/placeholder.svg"}
                        alt={notification.user?.name}
                      />
                      <AvatarFallback>{notification.user ? getInitials(notification.user.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div className={cn("absolute -bottom-1 -right-1 p-1 rounded-full", iconConfig.bg)}>
                      <Icon className={cn("h-3 w-3", iconConfig.color)} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.user?.name}</span> {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
