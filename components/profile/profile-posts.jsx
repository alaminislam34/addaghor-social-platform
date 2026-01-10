"use client"

import { useState, useEffect } from "react"
import { Lock, Grid, List } from "lucide-react"
import { PostCard } from "@/components/feed/post-card"
import { PostSkeleton } from "@/components/feed/post-skeleton"
import { getPosts } from "@/lib/api"
import { cn } from "@/lib/utils"

export function ProfilePosts({ userId, isOwnProfile, isPrivateProfile }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("list")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts({ userId })
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [userId])

  if (isPrivateProfile && !isOwnProfile) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-lg mb-4">Posts</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">This profile is private</p>
          <p className="text-sm text-muted-foreground mt-1">Only friends can see their posts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Posts</h2>
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50",
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50",
            )}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              {post.images?.[0] ? (
                <img src={post.images[0] || "/placeholder.svg"} alt="" className="w-full h-full object-cover bg-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground text-center line-clamp-4">{post.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
