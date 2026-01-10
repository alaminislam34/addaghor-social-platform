"use client"

import { useState, useEffect } from "react"
import { CreatePost } from "@/components/feed/create-post"
import { PostCard } from "@/components/feed/post-card"
import { PostSkeleton } from "@/components/feed/post-skeleton"
import { StoryBar } from "@/components/story/story-bar"
import { NotesBar } from "@/components/story/notes-bar"
import { getPosts } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts()
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [{ ...newPost, user }, ...prev])
  }

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="max-w-3xl mx-auto w-full md:p-4 space-y-4">
      {/* Stories */}
      <StoryBar />

      {/* Notes */}
      <NotesBar />

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
      ) : posts.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />)
      )}
    </div>
  )
}
