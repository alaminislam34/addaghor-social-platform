"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Phone, Video, Info, ImageIcon, Smile, Send, MoreHorizontal, Trash2, Ban, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials, formatDate, cn } from "@/lib/utils"
import { getMessages, sendMessage } from "@/lib/api"

export function ChatWindow({ conversation, onBack }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) return
      setIsLoading(true)
      try {
        const data = await getMessages(conversation.id)
        setMessages(data)
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMessages()
  }, [conversation?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const message = await sendMessage(conversation.id, newMessage)
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary/50">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Send className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Your messages</h3>
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </div>
      </div>
    )
  }

  const otherUser = conversation.otherUser

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-accent transition-colors md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link href={`/profile/${otherUser?.username}`} className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} alt={otherUser?.name} />
                <AvatarFallback>{otherUser ? getInitials(otherUser.name) : "U"}</AvatarFallback>
              </Avatar>
              {otherUser?.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>
            <div>
              <p className="font-semibold">{otherUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {otherUser?.isOnline ? "Active now" : `Active ${formatDate(otherUser?.lastSeen)}`}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-accent transition-colors text-primary">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-accent transition-colors text-primary">
            <Video className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-20">
                  <Link
                    href={`/profile/${otherUser?.username}`}
                    className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Info className="h-4 w-4" />
                    <span>View profile</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left">
                    <Ban className="h-4 w-4" />
                    <span>Block</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete chat</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn("flex gap-2", i % 2 === 0 ? "justify-start" : "justify-end")}>
                {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                <Skeleton className={cn("h-12 rounded-2xl", i % 2 === 0 ? "w-48" : "w-36")} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Avatar className="h-16 w-16 mb-4">
              <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} alt={otherUser?.name} />
              <AvatarFallback>{otherUser ? getInitials(otherUser.name) : "U"}</AvatarFallback>
            </Avatar>
            <p className="font-semibold">{otherUser?.name}</p>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === "1"
              const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId)

              return (
                <div key={message.id} className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
                  {!isOwn && (
                    <div className="w-8">
                      {showAvatar && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={otherUser?.avatar || "/placeholder.svg"} alt={otherUser?.name} />
                          <AvatarFallback>{otherUser ? getInitials(otherUser.name) : "U"}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2 rounded-2xl",
                      isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary rounded-bl-md",
                    )}
                  >
                    <p>{message.content}</p>
                    <p
                      className={cn("text-[10px] mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}
                    >
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 rounded-full hover:bg-accent transition-colors">
            <ImageIcon className="h-5 w-5 text-primary" />
          </button>
          <div className="flex-1 relative">
            <Input
              placeholder="Aa"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-10 rounded-full bg-secondary border-0"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={cn(
              "p-2 rounded-full transition-colors",
              newMessage.trim() ? "text-primary hover:bg-accent" : "text-muted-foreground",
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
