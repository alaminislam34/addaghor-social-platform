"use client"

import { useState, useRef } from "react"
import { ImageIcon, Video, Smile, MapPin, Users, Globe, Lock, ChevronDown, X, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import { createPost } from "@/lib/api"

const audienceOptions = [
  { value: "public", label: "Public", icon: Globe, description: "Anyone can see this post" },
  { value: "friends", label: "Friends", icon: Users, description: "Only your friends can see" },
  { value: "only_me", label: "Only Me", icon: Lock, description: "Only you can see this post" },
]

export function CreatePost({ onPostCreated }) {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [content, setContent] = useState("")
  const [images, setImages] = useState([])
  const [audience, setAudience] = useState("public")
  const [showAudienceMenu, setShowAudienceMenu] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const selectedAudience = audienceOptions.find((opt) => opt.value === audience)
  const AudienceIcon = selectedAudience?.icon

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages].slice(0, 4))
  }

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return

    setIsSubmitting(true)
    try {
      const newPost = await createPost({
        content,
        images: images.map((img) => img.preview),
        audience,
      })
      onPostCreated?.(newPost)
      setContent("")
      setImages([])
      setAudience("public")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Compact create post card */}
      <div className="bg-card rounded-xl border p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 text-left px-4 py-2.5 bg-secondary rounded-full text-muted-foreground hover:bg-accent transition-colors"
          >
            What's on your mind, {user?.name?.split(" ")[0]}?
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <button
            onClick={() => {
              setIsDialogOpen(true)
              setTimeout(() => fileInputRef.current?.click(), 100)
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
          >
            <ImageIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Photo</span>
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
          >
            <Video className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Video</span>
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
          >
            <Smile className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Feeling</span>
          </button>
        </div>
      </div>

      {/* Full create post dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Create post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* User info & audience selector */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <div className="relative">
                  <button
                    onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                    className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md hover:bg-accent transition-colors"
                  >
                    <AudienceIcon className="h-3 w-3" />
                    {selectedAudience?.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showAudienceMenu && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-card border rounded-lg shadow-lg z-10">
                      {audienceOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setAudience(option.value)
                            setShowAudienceMenu(false)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                        >
                          <div className="p-2 rounded-full bg-secondary">
                            <option.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content textarea */}
            <Textarea
              placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-30 border-0 resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 p-0"
            />

            {/* Image previews */}
            {images.length > 0 && (
              <div
                className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
              >
                {images.map((img, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-square">
                    <img
                      src={img.preview || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add to post */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium text-sm">Add to your post</span>
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-green-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-accent transition-colors">
                  <MapPin className="h-5 w-5 text-red-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-accent transition-colors">
                  <Smile className="h-5 w-5 text-yellow-500" />
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={(!content.trim() && images.length === 0) || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
