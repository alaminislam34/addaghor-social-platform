"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Camera,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  MessageCircle,
  Lock,
  Globe,
  Users,
  Flag,
  Ban,
  Edit,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { formatNumber, getInitials } from "@/lib/utils"
import { sendFriendRequest, blockUser, reportUser } from "@/lib/api"

export function ProfileHeader({ profile, isOwnProfile }) {
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [friendRequestSent, setFriendRequestSent] = useState(false)

  const handleAddFriend = async () => {
    try {
      await sendFriendRequest(profile.id)
      setFriendRequestSent(true)
    } catch (error) {
      console.error("Error sending friend request:", error)
    }
  }

  const handleBlock = async () => {
    try {
      await blockUser(profile.id)
      setShowBlockDialog(false)
    } catch (error) {
      console.error("Error blocking user:", error)
    }
  }

  const handleReport = async (reason) => {
    try {
      await reportUser(profile.id, reason)
      setShowReportDialog(false)
    } catch (error) {
      console.error("Error reporting user:", error)
    }
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 md:h-80 bg-muted">
        {profile.coverPhoto ? (
          <Image src={profile.coverPhoto || "/placeholder.svg"} alt="Cover" fill className="object-cover bg-cover" priority />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-primary/20 to-primary/5" />
        )}
        {isOwnProfile && (
          <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 gap-2 bg-card/90 backdrop-blur-sm">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Edit cover photo</span>
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-card">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-4xl">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 p-2 bg-secondary rounded-full hover:bg-accent transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            )}
            {profile.isPrivate && !isOwnProfile && (
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-card rounded-full border-2 border-card">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Name & Stats */}
          <div className="flex-1 sm:ml-4 sm:mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
              {profile.isPrivate ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground">@{profile.username}</p>
            <div className="flex items-center gap-6 mt-2 text-sm">
              <span>
                <strong>{formatNumber(profile.friendsCount)}</strong> friends
              </span>
              <span>
                <strong>{formatNumber(profile.followers)}</strong> followers
              </span>
              <span>
                <strong>{formatNumber(profile.following)}</strong> following
              </span>
            </div>
            {profile.mutualFriends > 0 && !isOwnProfile && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {profile.mutualFriends} mutual friends
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:mb-4">
            {isOwnProfile ? (
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/settings/profile">
                  <Edit className="h-4 w-4" />
                  Edit profile
                </Link>
              </Button>
            ) : (
              <>
                {isFriend ? (
                  <Button variant="secondary" className="gap-2">
                    <Users className="h-4 w-4" />
                    Friends
                  </Button>
                ) : friendRequestSent ? (
                  <Button variant="secondary" disabled className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Request sent
                  </Button>
                ) : (
                  <Button onClick={handleAddFriend} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add friend
                  </Button>
                )}
                <Button
                  variant={isFollowing ? "secondary" : "outline"}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="gap-2 bg-transparent"
                >
                  {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="secondary" asChild className="gap-2">
                  <Link href={`/messages?user=${profile.id}`}>
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Message</span>
                  </Link>
                </Button>
              </>
            )}

            {/* More options */}
            <div className="relative">
              <Button variant="secondary" size="icon" onClick={() => setShowMenu(!showMenu)}>
                <MoreHorizontal className="h-5 w-5" />
              </Button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-card border rounded-lg shadow-lg z-20">
                    {!isOwnProfile && (
                      <>
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            setShowBlockDialog(true)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                        >
                          <Ban className="h-5 w-5" />
                          <span>Block {profile.name.split(" ")[0]}</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            setShowReportDialog(true)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left text-destructive"
                        >
                          <Flag className="h-5 w-5" />
                          <span>Report profile</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && <p className="mt-4 text-sm">{profile.bio}</p>}
      </div>

      {/* Block dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block {profile.name}?</DialogTitle>
            <DialogDescription>
              They won't be able to see your posts, find your profile, or message you. You can unblock them anytime.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlock}>
              Block
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report {profile.name}</DialogTitle>
            <DialogDescription>Why are you reporting this profile?</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {["Fake account", "Harassment", "Spam", "Inappropriate content", "Other"].map((reason) => (
              <button
                key={reason}
                onClick={() => handleReport(reason)}
                className="w-full p-3 text-left rounded-lg hover:bg-accent transition-colors"
              >
                {reason}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
