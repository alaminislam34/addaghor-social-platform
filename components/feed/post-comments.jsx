"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Send, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { formatDate, getInitials, cn } from "@/lib/utils"
import { getComments, createComment } from "@/lib/api"

export function PostComments({ postId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likedComments, setLikedComments] = useState(new Set())

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(postId)
        setComments(data)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const comment = await createComment(postId, newComment)
      setComments((prev) => [
        ...prev,
        {
          ...comment,
          user: user,
        },
      ])
      setNewComment("")
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLike = (commentId) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  return (
    <div className="border-t p-4 space-y-4">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-secondary rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-primary",
              (!newComment.trim() || isSubmitting) && "opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/profile/${comment.user?.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.name} />
                  <AvatarFallback>{comment.user ? getInitials(comment.user.name) : "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="bg-secondary rounded-2xl px-4 py-2">
                  <Link href={`/profile/${comment.user?.username}`} className="font-semibold text-sm hover:underline">
                    {comment.user?.name}
                  </Link>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-2">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={cn(
                      "text-xs font-medium hover:underline",
                      likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    Like
                  </button>
                  <button className="text-xs font-medium text-muted-foreground hover:underline">Reply</button>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  {(comment.likes > 0 || likedComments.has(comment.id)) && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className={cn("h-3 w-3", likedComments.has(comment.id) && "fill-primary text-primary")} />
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
