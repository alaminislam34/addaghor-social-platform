"use client"

import { useState, useEffect } from "react"
import { Search, Users, UserPlus, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { FriendCard } from "@/components/friends/friend-card"
import { FriendRequestCard } from "@/components/friends/friend-request-card"
import { FriendSuggestionCard } from "@/components/friends/friend-suggestion-card"
import { getUsers, getFriendRequests, getFriendSuggestions } from "@/lib/api"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsData, requestsData, suggestionsData] = await Promise.all([
          getUsers(),
          getFriendRequests(),
          getFriendSuggestions(),
        ])
        setFriends(friendsData.filter((u) => u.id !== "1"))
        setRequests(requestsData)
        setSuggestions(suggestionsData)
      } catch (error) {
        console.error("Error fetching friends data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Friends</h1>
        <p className="text-muted-foreground">Manage your friends and connections</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-secondary">
          <TabsTrigger value="all" className="gap-2">
            <Users className="h-4 w-4" />
            All Friends
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Clock className="h-4 w-4" />
            Requests
            {requests.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        {/* All Friends */}
        <TabsContent value="all" className="mt-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No friends found matching your search" : "No friends yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Friend Requests */}
        <TabsContent value="requests" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending friend requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Suggestions */}
        <TabsContent value="suggestions" className="mt-6">
          <h3 className="font-semibold mb-4">People you may know</h3>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border overflow-hidden">
                  <Skeleton className="h-24 w-full" />
                  <div className="p-4 -mt-8 flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-5 w-24 mt-2" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No suggestions available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {suggestions.map((user) => (
                <FriendSuggestionCard
                  key={user.id}
                  user={user}
                  onDismiss={(id) => setSuggestions((prev) => prev.filter((u) => u.id !== id))}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
