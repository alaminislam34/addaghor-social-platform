"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { UserPlus, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getFriendSuggestions, getUsers } from "@/lib/api"
import { getInitials } from "@/lib/utils"

export function RightSidebar() {
  const [suggestions, setSuggestions] = useState([])
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suggestionsData, usersData] = await Promise.all([getFriendSuggestions(), getUsers()])
        setSuggestions(suggestionsData.slice(0, 3))
        setContacts(usersData.filter((u) => u.id !== "1").slice(0, 5))
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <aside className="hidden xl:block w-80 p-4 space-y-6">
      {/* Friend Suggestions */}
      <div className="bg-card rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">People you may know</h3>
          <Link href="/friends" className="text-sm text-primary hover:underline">
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            : suggestions.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Link href={`/profile/${user.username}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium text-sm hover:underline truncate block"
                    >
                      {user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{user.mutualFriends} mutual friends</p>
                  </div>
                  <Button size="sm" variant="secondary" className="h-8">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
        </div>
      </div>

      {/* Online Contacts */}
      <div className="bg-card rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Contacts</h3>
          <button className="p-1 rounded hover:bg-accent transition-colors">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            : contacts.map((user) => (
                <Link
                  key={user.id}
                  href={`/messages?user=${user.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium truncate">{user.name}</span>
                </Link>
              ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/advertising" className="hover:underline">
            Advertising
          </Link>
          <Link href="/cookies" className="hover:underline">
            Cookies
          </Link>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
        </div>
        <p>Addaghor © {new Date().getFullYear()}</p>
      </div>
    </aside>
  )
}
