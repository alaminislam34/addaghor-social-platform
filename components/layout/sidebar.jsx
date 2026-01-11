"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  Bookmark,
  Settings,
  Calendar,
  ShoppingBag,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { getInitials, cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/friends", icon: Users, label: "Friends" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
];

const shortcutItems = [
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
];

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full">
          <div className="space-y-6 sticky top-20 max-h-[90svh] h-full flex flex-col justify-between ">
            {/* Mobile close button */}
            <div className="flex items-center justify-between p-4 lg:hidden border-b ">
              <span className="font-semibold text-lg">Menu</span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile section */}
            <div className="p-4 border-b lg:mt-4">
              <Link
                href={`/profile/${user?.username}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={onClose}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    @{user?.username}
                  </p>
                </div>
              </Link>
            </div>

            {/* Main navigation */}
            <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.label === "Messages" && (
                        <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                          2
                        </span>
                      )}
                      {item.label === "Notifications" && (
                        <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                          5
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Shortcuts */}
              <div className="mt-6">
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Shortcuts
                </p>
                <div className="space-y-1">
                  {shortcutItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t ">
              <Link
                href="/settings"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  pathname === "/settings"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
              <p className="mt-4 px-3 text-xs text-muted-foreground">
                Addaghor © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
