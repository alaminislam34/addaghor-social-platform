"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ImageIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getUserByUsername, getPosts } from "@/lib/api"

export default function ProfilePhotosPage() {
  const router = useRouter()
  const params = useParams()
  const [profile, setProfile] = useState(null)
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await getUserByUsername(params.username)
        setProfile(profileData)

        if (profileData) {
          const posts = await getPosts({ userId: profileData.id })
          // Extract all images from posts
          const allPhotos = posts.flatMap((post) => post.images || []).filter(Boolean)
          setPhotos(allPhotos)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [params.username])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
        <Button onClick={() => router.push("/feed")}>Go to Feed</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{profile.name}&apos;s Photos</h1>
          <p className="text-sm text-muted-foreground">{photos.length} photos</p>
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold mb-2">No photos yet</h2>
            <p className="text-muted-foreground">Photos will appear here when posted</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted hover:opacity-90 transition-opacity"
            >
              <Image src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          {selectedPhoto && (
            <div className="relative w-full aspect-video">
              <Image src={selectedPhoto || "/placeholder.svg"} alt="Full size photo" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
