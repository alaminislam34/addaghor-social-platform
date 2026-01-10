"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials, formatDate } from "@/lib/utils"
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/api"

export function FriendRequestCard({ request, onAccept, onReject }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await acceptFriendRequest(request.id)
      setStatus("accepted")
      onAccept?.(request.id)
    } catch (error) {
      console.error("Error accepting request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await rejectFriendRequest(request.id)
      setStatus("rejected")
      onReject?.(request.id)
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status) {
    return (
      <div className="bg-card rounded-xl border p-4 text-center text-muted-foreground">
        Request {status === "accepted" ? "accepted" : "declined"}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${request.fromUser?.username}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={request.fromUser?.avatar || "/placeholder.svg"} alt={request.fromUser?.name} />
            <AvatarFallback>{request.fromUser ? getInitials(request.fromUser.name) : "U"}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${request.fromUser?.username}`} className="font-semibold hover:underline">
            {request.fromUser?.name}
          </Link>
          <p className="text-sm text-muted-foreground">{request.fromUser?.mutualFriends || 0} mutual friends</p>
          <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="flex-1" onClick={handleAccept} disabled={isLoading}>
          <Check className="h-4 w-4 mr-2" />
          Accept
        </Button>
        <Button variant="secondary" className="flex-1" onClick={handleReject} disabled={isLoading}>
          <X className="h-4 w-4 mr-2" />
          Decline
        </Button>
      </div>
    </div>
  )
}
