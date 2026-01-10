"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MoreHorizontal,
  Eye,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "../../lib/utils";
import { getInitials } from "../../lib/utils";
// import { formatDate, getInitials, cn } from "@/lib/utils";

export function StoryViewer({ stories, initialIndex, onClose }) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reply, setReply] = useState("");

  const currentUser = stories[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [
    currentStoryIndex,
    currentUser?.stories.length,
    currentUserIndex,
    stories.length,
    onClose,
  ]);

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      const prevUser = stories[currentUserIndex - 1];
      setCurrentStoryIndex(prevUser.stories.length - 1);
      setProgress(0);
    }
  }, [currentStoryIndex, currentUserIndex, stories]);

  // Progress timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, goToNextStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextStory();
      if (e.key === "ArrowLeft") goToPrevStory();
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToNextStory, goToPrevStory, onClose]);

  const handleReply = (e) => {
    e.preventDefault();
    if (reply.trim()) {
      // Handle reply
      setReply("");
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation areas */}
      <button
        onClick={goToPrevStory}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-start p-4"
        disabled={currentUserIndex === 0 && currentStoryIndex === 0}
      >
        <ChevronLeft className="h-8 w-8 text-white/50 hover:text-white transition-colors" />
      </button>
      <button
        onClick={goToNextStory}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-10 flex items-center justify-end p-4"
      >
        <ChevronRight className="h-8 w-8 text-white/50 hover:text-white transition-colors" />
      </button>

      {/* Story content */}
      <div className="relative w-full max-w-md h-full max-h-[90vh] mx-4 bg-black rounded-xl overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {currentUser.stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={cn(
                  "h-full bg-white transition-all duration-100",
                  index < currentStoryIndex && "w-full",
                  index > currentStoryIndex && "w-0"
                )}
                style={{
                  width:
                    index === currentStoryIndex ? `${progress}%` : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/30">
              <AvatarImage
                src={currentUser.user?.avatar || "/placeholder.svg"}
                alt={currentUser.user?.name}
              />
              <AvatarFallback>
                {currentUser.user ? getInitials(currentUser.user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="font-semibold text-sm">{currentUser.user?.name}</p>
              <p className="text-xs text-white/70">
                {formatDate(currentStory.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 text-white/80 hover:text-white"
            >
              {isPaused ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </button>
            <button className="p-2 text-white/80 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Story image */}
        <div className="relative w-full h-full">
          {currentStory.type === "image" && (
            <Image
              src={currentStory.content || "/placeholder.svg"}
              alt="Story"
              fill
              className="object-contain bg-cover"
            />
          )}
          {currentStory.caption && (
            <div className="absolute bottom-24 left-4 right-4 text-center">
              <p className="text-white text-lg font-medium drop-shadow-lg">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-linear-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2 mb-3 text-white/70 text-sm">
            <Eye className="h-4 w-4" />
            <span>{currentStory.views} views</span>
          </div>
          <form onSubmit={handleReply} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Reply to story..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <button
              type="submit"
              disabled={!reply.trim()}
              className="p-2 text-white/80 hover:text-white disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
