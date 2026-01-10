"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { getUserByUsername, updateProfile } from "@/lib/api"
import { getInitials } from "@/lib/utils"

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState(null)

  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    work: "",
    education: "",
    relationship: "",
    hometown: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserByUsername(params.username)
        if (data) {
          setProfile(data)
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            work: data.about?.work || "",
            education: data.about?.education || "",
            relationship: data.about?.relationship || "",
            hometown: data.about?.hometown || "",
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [params.username])

  // Redirect if not the owner
  useEffect(() => {
    if (!isLoading && profile && currentUser?.username !== params.username) {
      router.replace(`/profile/${params.username}`)
    }
  }, [isLoading, profile, currentUser, params.username, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile(profile.id, form)
      router.push(`/profile/${params.username}`)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

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
        <p className="text-muted-foreground mb-4">The profile you are looking for does not exist.</p>
        <Button onClick={() => router.push("/feed")}>Go to Feed</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      {/* Cover Photo & Avatar */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40 rounded-t-lg">
              <button className="absolute right-4 top-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute left-4 -bottom-10">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-12" />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>This information will be visible on your public profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{form.bio.length}/200 characters</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Current City</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hometown">Hometown</Label>
              <Input
                id="hometown"
                value={form.hometown}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
                placeholder="Where you grew up"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work & Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Work & Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="work">Work</Label>
            <Input
              id="work"
              value={form.work}
              onChange={(e) => setForm({ ...form, work: e.target.value })}
              placeholder="Job title at Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
              placeholder="School or University"
            />
          </div>
        </CardContent>
      </Card>

      {/* Relationship */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Relationship Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={form.relationship} onValueChange={(value) => setForm({ ...form, relationship: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="In a relationship">In a relationship</SelectItem>
              <SelectItem value="Engaged">Engaged</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="It's complicated">It is complicated</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
