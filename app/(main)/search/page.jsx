"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Users, FileText, ImageIcon, MapPin, Loader2, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchUsers, searchPosts } from "@/lib/api"
import { getInitials, formatTimeAgo } from "@/lib/utils"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState({ users: [], posts: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 2) {
        setResults({ users: [], posts: [] })
        return
      }
      setIsLoading(true)
      try {
        const [users, posts] = await Promise.all([searchUsers(query), searchPosts(query)])
        setResults({ users, posts })
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(performSearch, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const tabs = [
    { id: "all", label: "All", icon: Search },
    { id: "people", label: "People", icon: Users },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "places", label: "Places", icon: MapPin },
  ]

  const filteredResults = {
    users: activeTab === "all" || activeTab === "people" ? results.users : [],
    posts: activeTab === "all" || activeTab === "posts" ? results.posts : [],
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Header */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for people, posts, photos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : query.length < 2 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search Addaghor</h2>
          <p className="text-muted-foreground">Find people, posts, photos, and more</p>
        </div>
      ) : filteredResults.users.length === 0 && filteredResults.posts.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">Try searching for something else</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* People Results */}
          {filteredResults.users.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                People
              </h3>
              <div className="grid gap-3">
                {filteredResults.users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Link href={`/profile/${user.username}`} className="flex items-center gap-3 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold hover:underline">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                            {user.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{user.bio}</p>}
                          </div>
                        </Link>
                        <div className="flex items-center gap-2">
                          {user.mutualFriends > 0 && <Badge variant="secondary">{user.mutualFriends} mutual</Badge>}
                          <Button size="sm">Add Friend</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {filteredResults.posts.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Posts
              </h3>
              <div className="grid gap-3">
                {filteredResults.posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.user?.avatar || "/placeholder.svg"} alt={post.user?.name} />
                          <AvatarFallback>{post.user ? getInitials(post.user.name) : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Link href={`/profile/${post.user?.username}`} className="font-semibold hover:underline">
                              {post.user?.name}
                            </Link>
                            <span className="text-sm text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
                          </div>
                          <p className="text-sm line-clamp-3">{post.content}</p>
                          {post.images && post.images.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {post.images.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img || "/placeholder.svg"}
                                  alt=""
                                  className="h-16 w-16 rounded-lg object-cover"
                                />
                              ))}
                              {post.images.length > 3 && (
                                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                                  <span className="text-sm font-medium">+{post.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
