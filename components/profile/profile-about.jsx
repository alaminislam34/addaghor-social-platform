"use client"

import { useState } from "react"
import { Briefcase, GraduationCap, Heart, Home, Globe, Calendar, Edit, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ProfileAbout({ profile, isOwnProfile, isPrivateProfile }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editField, setEditField] = useState(null)

  const aboutItems = [
    { icon: Briefcase, label: "Works at", value: profile.about?.work },
    { icon: GraduationCap, label: "Studied at", value: profile.about?.education },
    { icon: Heart, label: "Relationship", value: profile.about?.relationship },
    { icon: Home, label: "From", value: profile.about?.hometown },
    { icon: Globe, label: "Website", value: profile.website, isLink: true },
    {
      icon: Calendar,
      label: "Joined",
      value: new Date(profile.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
  ]

  if (isPrivateProfile && !isOwnProfile) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-lg mb-4">About</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">This profile is private</p>
          <p className="text-sm text-muted-foreground mt-1">Only friends can see their details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">About</h2>
        {isOwnProfile && (
          <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {aboutItems.map((item, index) => {
          if (!item.value) return null
          return (
            <div key={index} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">{item.label} </span>
                {item.isLink ? (
                  <a
                    href={`https://${item.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-medium">{item.value}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {profile.about?.interests?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.about.interests.map((interest) => (
              <span key={interest} className="px-3 py-1 bg-secondary rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea placeholder="Write something about yourself..." defaultValue={profile.bio} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Work</label>
              <Input placeholder="Where do you work?" defaultValue={profile.about?.work} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Education</label>
              <Input placeholder="Where did you study?" defaultValue={profile.about?.education} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Where are you from?" defaultValue={profile.about?.hometown} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input placeholder="Your website" defaultValue={profile.website} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowEditDialog(false)}>Save changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
