"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getInitials, cn } from "@/lib/utils";
import { getStories } from "@/lib/api";
import { StoryViewer } from "./story-viewer";
import { CreateStoryDialog } from "./create-story-dialog";

export function StoryBar() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth,
        );
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [stories]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleStoryCreated = (newStory) => {
    setStories((prev) => [{ ...newStory, user }, ...prev]);
  };

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user?.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  const storyUsers = Object.values(groupedStories);

  return (
    <>
      <div className="bg-card rounded-xl border p-4 mb-4">
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border rounded-full shadow-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card border rounded-full shadow-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Stories container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar py-1 px-1"
          >
            {/* Create story button */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex flex-col items-center gap-1 min-w-19"
            >
              <div className="relative">
                <Avatar className="md:h-16 md:w-16 w-14 h-14 border-2 border-black">
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full border-2 border-card">
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xs text-center truncate w-full">
                Your story
              </span>
            </button>

            {/* Story avatars */}
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 min-w-19"
                  >
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))
              : storyUsers.map((item, index) => (
                  <button
                    key={item.user?.id}
                    onClick={() => setSelectedStoryIndex(index)}
                    className="flex flex-col items-center gap-1 min-w-19 group"
                  >
                    <div
                      className={cn(
                        "p-0.5 rounded-full bg-linear-to-tr from-primary via-primary to-primary/50",
                        "group-hover:scale-105 transition-transform",
                      )}
                    >
                      <Avatar className="h-16 w-16 border-2 border-card">
                        <AvatarImage
                          src={item.user?.avatar || "/placeholder.svg"}
                          alt={item.user?.name}
                        />
                        <AvatarFallback>
                          {item.user ? getInitials(item.user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs text-center truncate w-full">
                      {item.user?.name?.split(" ")[0]}
                    </span>
                  </button>
                ))}
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={storyUsers}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Create Story Dialog */}
      <CreateStoryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onStoryCreated={handleStoryCreated}
      />
    </>
  );
}
