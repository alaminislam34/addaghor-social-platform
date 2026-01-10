"use client"

import { useState, useEffect } from "react"
import { Search, Edit, MoreHorizontal, Trash2, Archive, BellOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials, formatDate, cn } from "@/lib/utils"
import { getConversations } from "@/lib/api"

export function ChatList({ selectedId, onSelect }) {
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMenu, setShowMenu] = useState(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations()
        setConversations(data)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No messages yet"}
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => onSelect(conv)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    selectedId === conv.id ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.otherUser?.avatar || "/placeholder.svg"} alt={conv.otherUser?.name} />
                      <AvatarFallback>{conv.otherUser ? getInitials(conv.otherUser.name) : "U"}</AvatarFallback>
                    </Avatar>
                    {conv.otherUser?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{conv.otherUser?.name}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(conv.lastMessage?.timestamp)}</span>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate",
                        conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      {conv.lastMessage?.senderId === "1" && "You: "}
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>

                {/* Menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(showMenu === conv.id ? null : conv.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {/* Dropdown menu */}
                {showMenu === conv.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                    <div className="absolute right-2 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-20">
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left">
                        <BellOff className="h-4 w-4" />
                        <span>Mute</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left">
                        <Archive className="h-4 w-4" />
                        <span>Archive</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
