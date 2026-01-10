"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Bookmark,
  BookmarkCheck,
  Flag,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
// import { formatDate, formatNumber, getInitials, cn } from "@/lib/utils"
import { likePost, sharePost, deletePost } from "@/lib/api";
import { PostComments } from "./post-comments";
import { cn, formatDate } from "../../lib/utils";
import { formatNumber } from "../../lib/utils";
import { getInitials } from "../../lib/utils";

const audienceIcons = {
  public: Globe,
  friends: Users,
  only_me: Lock,
};

export function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = user?.id === post.userId;
  const AudienceIcon = audienceIcons[post.audience] || Globe;

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await likePost(post.id);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleShare = async () => {
    setShowShareDialog(true);
    try {
      await sharePost(post.id);
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onDelete?.(post.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openImage = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  return (
    <article className="bg-card rounded-xl border">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <Link href={`/profile/${post.user?.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.user?.avatar || "/placeholder.svg"}
                alt={post.user?.name}
              />
              <AvatarFallback>
                {post.user ? getInitials(post.user.name) : "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/profile/${post.user?.username}`}
              className="font-semibold hover:underline"
            >
              {post.user?.name}
            </Link>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <AudienceIcon className="h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-56 bg-card border rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    setIsSaved(!isSaved);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                  <span>{isSaved ? "Unsave post" : "Save post"}</span>
                </button>
                {isOwnPost ? (
                  <>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                    >
                      <Edit className="h-5 w-5" />
                      <span>Edit post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteDialog(true);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Delete post</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left text-destructive"
                  >
                    <Flag className="h-5 w-5" />
                    <span>Report post</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* Images */}
      {post.images?.length > 0 && (
        <div
          className={cn(
            "grid gap-0.5",
            post.images.length === 1 && "grid-cols-1",
            post.images.length === 2 && "grid-cols-2",
            post.images.length === 3 && "grid-cols-2",
            post.images.length >= 4 && "grid-cols-2"
          )}
        >
          {post.images.slice(0, 4).map((img, index) => (
            <button
              key={index}
              onClick={() => openImage(index)}
              className={cn(
                "relative overflow-hidden bg-muted",
                post.images.length === 1 && "aspect-video",
                post.images.length === 2 && "aspect-square",
                post.images.length === 3 &&
                  index === 0 &&
                  "row-span-2 aspect-auto",
                post.images.length === 3 && index !== 0 && "aspect-square",
                post.images.length >= 4 && "aspect-square"
              )}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{post.images.length - 4}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      {(likesCount > 0 || post.comments > 0 || post.shares > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {likesCount > 0 && (
              <>
                <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-full">
                  <Heart className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                </div>
                <span>{formatNumber(likesCount)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {post.comments > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline"
              >
                {formatNumber(post.comments)} comments
              </button>
            )}
            {post.shares > 0 && <span>{formatNumber(post.shares)} shares</span>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center border-t mx-4">
        <button
          onClick={handleLike}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors",
            isLiked ? "text-primary" : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-primary")} />
          <span className="font-medium">Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">Comment</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && <PostComments postId={post.id} />}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={() => setShowShareDialog(false)}
            >
              <Share2 className="h-5 w-5" />
              Share to your feed
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={() => setShowShareDialog(false)}
            >
              <MessageCircle className="h-5 w-5" />
              Send in message
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShareDialog(false);
              }}
            >
              <Link className="h-5 w-5" />
              Copy link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          {post.images?.[selectedImageIndex] && (
            <div className="relative w-full aspect-video">
              <Image
                src={post.images[selectedImageIndex] || "/placeholder.svg"}
                alt="Full size image"
                fill
                className="object-contain"
              />
            </div>
          )}
          {post.images?.length > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === selectedImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
