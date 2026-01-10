"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, PlusSquare, MessageCircle, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/friends", icon: Users, label: "Friends" },
  { href: "/create", icon: PlusSquare, label: "Create" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-15",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        <Link
          href={`/profile/${user?.username}`}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-15",
            pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
