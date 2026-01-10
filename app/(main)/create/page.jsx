"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, X, Globe, Users, Lock, ChevronDown, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import { createPost } from "@/lib/api"

const audienceOptions = [
  { value: "public", label: "Public", icon: Globe, description: "Anyone can see this post" },
  { value: "friends", label: "Friends", icon: Users, description: "Only your friends can see" },
  { value: "only_me", label: "Only Me", icon: Lock, description: "Only you can see this post" },
]

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
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
      await createPost({
        content,
        images: images.map((img) => img.preview),
        audience,
      })
      router.push("/feed")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <h1 className="text-xl font-semibold text-center border-b pb-4">Create Post</h1>

        {/* User info & audience selector */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <div className="relative">
              <button
                onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                className="flex items-center gap-1 text-sm bg-secondary px-3 py-1 rounded-md hover:bg-accent transition-colors"
              >
                <AudienceIcon className="h-4 w-4" />
                {selectedAudience?.label}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showAudienceMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowAudienceMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-64 bg-card border rounded-lg shadow-lg z-20">
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
                          <option.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content textarea */}
        <Textarea
          placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] border-0 resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
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
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add photo button */}
        <div className="border rounded-lg p-3">
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
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            <ImageIcon className="h-6 w-6 text-green-500" />
            <span className="font-medium">Add Photos</span>
          </button>
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={(!content.trim() && images.length === 0) || isSubmitting}
          className="w-full"
          size="lg"
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
    </div>
  )
}
