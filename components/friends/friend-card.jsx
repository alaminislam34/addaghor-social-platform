"use client"

import { useState } from "react"
import Link from "next/link"
import { UserMinus, MessageCircle, MoreHorizontal, Ban } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

export function FriendCard({ friend, onRemove }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${friend.username}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
            <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${friend.username}`} className="font-semibold hover:underline">
            {friend.name}
          </Link>
          <p className="text-sm text-muted-foreground truncate">{friend.mutualFriends} mutual friends</p>
          <p className="text-sm text-muted-foreground truncate">{friend.location}</p>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-accent transition-colors">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-20">
                <Link
                  href={`/messages?user=${friend.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </Link>
                <button
                  onClick={() => {
                    onRemove?.(friend.id)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Unfriend</span>
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                >
                  <Ban className="h-4 w-4" />
                  <span>Block</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="secondary" className="flex-1" asChild>
          <Link href={`/messages?user=${friend.id}`}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Link>
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onRemove?.(friend.id)}>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfriend
        </Button>
      </div>
    </div>
  )
}
