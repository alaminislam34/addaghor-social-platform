"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import { sendFriendRequest } from "@/lib/api"

export function FriendSuggestionCard({ user, onDismiss }) {
  const [isLoading, setIsLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const handleAddFriend = async () => {
    setIsLoading(true)
    try {
      await sendFriendRequest(user.id)
      setRequestSent(true)
    } catch (error) {
      console.error("Error sending friend request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Cover image */}
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 relative">
        {user.coverPhoto && (
          <img src={user.coverPhoto || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
        )}
        <button
          onClick={() => onDismiss?.(user.id)}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 -mt-8">
        <Link href={`/profile/${user.username}`} className="block">
          <Avatar className="h-16 w-16 border-4 border-card mx-auto">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="text-center mt-2">
          <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
            {user.name}
          </Link>
          <p className="text-sm text-muted-foreground">{user.mutualFriends} mutual friends</p>
        </div>

        <Button
          className="w-full mt-4"
          variant={requestSent ? "secondary" : "default"}
          onClick={handleAddFriend}
          disabled={isLoading || requestSent}
        >
          {requestSent ? (
            "Request Sent"
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
