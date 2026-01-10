"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Music } from "lucide-react";
import Image from "next/image"; // Next.js Optimized Image

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/use-auth";
import { getInitials, formatDate } from "@/lib/utils";
import { getNotes, createNote } from "@/lib/api";

export function NotesBar() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getNotes();
        if (mounted) setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateNote = useCallback(async () => {
    if (!newNote.trim() || !user) return;
    setIsSubmitting(true);
    try {
      const note = await createNote(newNote.trim());
      setNotes((prev) => [{ ...note, user }, ...prev]);
      setNewNote("");
      setCreateOpen(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [newNote, user]);

  return (
    <section
      aria-labelledby="notes-title"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 id="notes-title" className="font-semibold text-foreground">
          User Status Notes
        </h2>
        <span
          className="text-xs text-muted-foreground"
          title="Notes expire in 24 hours"
        >
          24h
        </span>
      </header>

      <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar">
        {/* Create Note Button */}
        <button
          type="button"
          aria-label="Create a new status note"
          onClick={() => setCreateOpen(true)}
          className="flex min-w-20 flex-col items-center gap-2 group"
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20 group-hover:border-primary transition-all">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.name}'s profile picture`}
                width={56}
                height={56}
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user ? getInitials(user.name) : "U"}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 z-10 rounded-full border-2 border-card bg-primary p-1">
              <Plus className="h-3 w-3 text-primary-foreground" />
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Add note</span>
        </button>

        {/* Loading Skeleton */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex min-w-20 flex-col items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}

        {/* Notes List */}
        {!isLoading &&
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              title={`View note from ${note.user.name}`}
              onClick={() => setViewNote(note)}
              className="group flex min-w-20 flex-col items-center gap-2"
            >
              <div className="relative">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/30 transition-colors group-hover:border-primary">
                  <Image
                    src={note.user.avatar || "/placeholder.svg"}
                    alt={`${note.user.name}'s status`}
                    width={56}
                    height={56}
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-card px-2 py-0.5 shadow-sm max-w-17.5">
                  <p className="truncate text-[10px] font-medium leading-tight">
                    {note.content}
                  </p>
                </div>
              </div>

              <span className="max-w-20 truncate text-xs text-muted-foreground">
                {note.user.name.split(" ")[0]}
              </span>
            </button>
          ))}
      </div>

      {/* DIALOGS (CREATE & VIEW) */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share a Thought</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              aria-label="Note content"
              value={newNote}
              maxLength={60}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="What's on your mind?"
              className="resize-none"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{newNote.length}/60</span>
              <button
                type="button"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Music className="h-4 w-4" /> Add music
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!newNote.trim() || isSubmitting}
                onClick={handleCreateNote}
              >
                {isSubmitting ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewNote} onOpenChange={() => setViewNote(null)}>
        <DialogContent className="sm:max-w-sm">
          {viewNote && (
            <article className="flex flex-col items-center py-4 text-center">
              <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-primary">
                <Image
                  src={viewNote.user.avatar || "/placeholder.svg"}
                  alt={viewNote.user.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{viewNote.user.name}</h3>
              <time
                dateTime={viewNote.createdAt}
                className="mb-4 text-xs text-muted-foreground"
              >
                {formatDate(viewNote.createdAt)}
              </time>
              <div className="rounded-xl bg-secondary px-6 py-4 shadow-inner">
                <p className="text-lg leading-relaxed">{viewNote.content}</p>
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
