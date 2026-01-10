"use client"

import { useState, useRef } from "react"
import { ImageIcon, Type, X, Globe, Users, Lock, ChevronDown, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createStory } from "@/lib/api"

const audienceOptions = [
  { value: "public", label: "Public", icon: Globe },
  { value: "friends", label: "Friends", icon: Users },
  { value: "only_me", label: "Only Me", icon: Lock },
]

export function CreateStoryDialog({ open, onOpenChange, onStoryCreated }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [caption, setCaption] = useState("")
  const [audience, setAudience] = useState("public")
  const [showAudienceMenu, setShowAudienceMenu] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const selectedAudience = audienceOptions.find((opt) => opt.value === audience)
  const AudienceIcon = selectedAudience?.icon

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!imagePreview) return

    setIsSubmitting(true)
    try {
      const newStory = await createStory({
        type: "image",
        content: imagePreview,
        caption,
        audience,
      })
      onStoryCreated?.(newStory)
      handleClose()
    } catch (error) {
      console.error("Error creating story:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setCaption("")
    setAudience("public")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!imagePreview ? (
            <div className="space-y-4">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-secondary rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-accent transition-colors"
              >
                <div className="p-4 rounded-full bg-primary/10">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Add photo</p>
                  <p className="text-sm text-muted-foreground">Share a moment with your friends</p>
                </div>
              </button>

              <button className="w-full p-4 bg-secondary rounded-lg flex items-center gap-3 hover:bg-accent transition-colors">
                <div className="p-3 rounded-full bg-primary/10">
                  <Type className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Create text story</p>
                  <p className="text-sm text-muted-foreground">Share what's on your mind</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-9/16 max-h-100 bg-black rounded-lg overflow-hidden mx-auto">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Story preview"
                  className="w-full h-full object-contain bg-cover"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Caption */}
              <Input placeholder="Add a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />

              {/* Audience selector */}
              <div className="relative">
                <button
                  onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md hover:bg-accent transition-colors"
                >
                  <AudienceIcon className="h-4 w-4" />
                  <span>{selectedAudience?.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showAudienceMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAudienceMenu(false)} />
                    <div className="absolute left-0 bottom-full mb-1 w-48 bg-card border rounded-lg shadow-lg z-20">
                      {audienceOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setAudience(option.value)
                            setShowAudienceMenu(false)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                        >
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    "Share story"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
