"use client"

import { useState, useEffect } from "react"
import { Bookmark, Grid, List } from "lucide-react"
import { PostCard } from "@/components/feed/post-card"
import { PostSkeleton } from "@/components/feed/post-skeleton"
import { getPosts } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function SavedPage() {
  const [savedPosts, setSavedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("list")

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const data = await getPosts()
        // Filter to only show saved posts
        setSavedPosts(data.filter((p) => p.isSaved))
      } catch (error) {
        console.error("Error fetching saved posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSavedPosts()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Saved</h1>
          <p className="text-muted-foreground">{savedPosts.length} saved items</p>
        </div>
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

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No saved posts yet</h3>
          <p className="text-muted-foreground text-sm">When you save posts, they'll appear here for easy access.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              {post.images?.[0] ? (
                <img src={post.images[0] || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
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
