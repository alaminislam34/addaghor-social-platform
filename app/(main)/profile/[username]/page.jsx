"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileAbout } from "@/components/profile/profile-about"
import { ProfilePosts } from "@/components/profile/profile-posts"
import { useAuth } from "@/hooks/use-auth"
import { getUserByUsername } from "@/lib/api"

export default function ProfilePage({ params }) {
  const { username } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isOwnProfile = user?.username === username
  const isPrivateProfile = profile?.isPrivate && !isOwnProfile

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserByUsername(username)
        if (!data) {
          setError("Profile not found")
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError("Error loading profile")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-card rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - About */}
        <div className="lg:col-span-1">
          <ProfileAbout profile={profile} isOwnProfile={isOwnProfile} isPrivateProfile={isPrivateProfile} />
        </div>

        {/* Right column - Posts */}
        <div className="lg:col-span-2">
          <ProfilePosts userId={profile.id} isOwnProfile={isOwnProfile} isPrivateProfile={isPrivateProfile} />
        </div>
      </div>
    </div>
  )
}
