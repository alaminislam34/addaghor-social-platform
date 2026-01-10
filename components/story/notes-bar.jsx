"use client";

import { useState, useEffect } from "react";
import { Plus, Music } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const note = await createNote(newNote);
      setNotes((prev) => [{ ...note, user }, ...prev]);
      setNewNote("");
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-xl border p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notes</h3>
          <span className="text-xs text-muted-foreground">24h</span>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
          {/* Create note button */}
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex flex-col items-center gap-2 min-w-20"
          >
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-dashed border-muted-foreground/30">
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
            <span className="text-xs text-muted-foreground">Add note</span>
          </button>

          {/* Notes */}
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 min-w-20"
                >
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))
            : notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setShowNoteDialog(note)}
                  className="flex flex-col items-center gap-2 min-w-20 group"
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-primary/30 group-hover:border-primary transition-colors">
                      <AvatarImage
                        src={note.user?.avatar || "/placeholder.svg"}
                        alt={note.user?.name}
                      />
                      <AvatarFallback>
                        {note.user ? getInitials(note.user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-card border rounded-full shadow-sm">
                      <p className="text-[10px] truncate max-w-15">
                        {note.content.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-17.5">
                    {note.user?.name?.split(" ")[0]}
                  </span>
                </button>
              ))}
        </div>
      </div>

      {/* Create Note Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share a quick thought with your friends. Notes expire after 24
              hours.
            </p>
            <Textarea
              placeholder="What's on your mind?"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value.slice(0, 60))}
              className="resize-none"
              maxLength={60}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{newNote.length}/60</span>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Music className="h-4 w-4" />
                Add music
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateNote}
                disabled={!newNote.trim() || isSubmitting}
              >
                {isSubmitting ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog
        open={!!showNoteDialog}
        onOpenChange={() => setShowNoteDialog(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center text-center py-4">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage
                src={showNoteDialog?.user?.avatar || "/placeholder.svg"}
                alt={showNoteDialog?.user?.name}
              />
              <AvatarFallback>
                {showNoteDialog?.user
                  ? getInitials(showNoteDialog.user.name)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold">{showNoteDialog?.user?.name}</p>
            <p className="text-xs text-muted-foreground mb-4">
              {showNoteDialog && formatDate(showNoteDialog.createdAt)}
            </p>
            <div className="px-6 py-4 bg-secondary rounded-xl">
              <p className="text-lg">{showNoteDialog?.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
