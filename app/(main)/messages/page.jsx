"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatList } from "@/components/chat/chat-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { getConversations } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get("user")
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // If a user ID is provided, open that conversation
    if (userIdParam) {
      const fetchConversations = async () => {
        const convs = await getConversations()
        const conv = convs.find((c) => c.otherUser?.id === userIdParam)
        if (conv) setSelectedConversation(conv)
      }
      fetchConversations()
    }
  }, [userIdParam])

  const showChatList = !isMobileView || !selectedConversation
  const showChatWindow = !isMobileView || selectedConversation

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] flex bg-background">
      {/* Chat List */}
      <div className={cn("w-full md:w-80 lg:w-96 border-r bg-card", showChatList ? "block" : "hidden")}>
        <ChatList selectedId={selectedConversation?.id} onSelect={(conv) => setSelectedConversation(conv)} />
      </div>

      {/* Chat Window */}
      <div className={cn("flex-1", showChatWindow ? "block" : "hidden")}>
        <ChatWindow conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
      </div>
    </div>
  )
}
