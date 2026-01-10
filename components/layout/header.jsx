"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  Search,
  Menu,
  Settings,
  LogOut,
  X,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/utils";
import { searchUsers, searchPosts } from "@/lib/api";

export function Header({ onMenuClick }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ users: [], posts: [] });
        return;
      }
      setIsSearching(true);
      try {
        const [users, posts] = await Promise.all([
          searchUsers(searchQuery),
          searchPosts(searchQuery),
        ]);
        setSearchResults({
          users: users.slice(0, 3),
          posts: posts.slice(0, 3),
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const cycleTheme = () => {
    const themes = ["light", "dark", "secondary"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon =
    theme === "dark" ? Moon : theme === "secondary" ? Palette : Sun;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="flex justify-between h-14 items-center px-4 gap-4">
        <div className="flex items-center gap-6">
          {/* Logo & Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/feed" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  A
                </span>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Addaghor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="pl-9 h-9 bg-secondary border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearch && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults.users.length === 0 &&
                  searchResults.posts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.users.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                          People
                        </p>
                        {searchResults.users.map((u) => (
                          <Link
                            key={u.id}
                            href={`/profile/${u.username}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                            onClick={() => setShowSearch(false)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={u.avatar || "/placeholder.svg"}
                                alt={u.name}
                              />
                              <AvatarFallback>
                                {getInitials(u.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">
                                @{u.username}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.posts.length > 0 && (
                      <div className="p-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                          Posts
                        </p>
                        {searchResults.posts.map((p) => (
                          <div
                            key={p.id}
                            className="p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => {
                              setShowSearch(false);
                              router.push("/feed");
                            }}
                          >
                            <p className="text-sm line-clamp-2">{p.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              by {p.user?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className="block p-3 text-center text-sm text-primary hover:bg-accent border-t"
                      onClick={() => setShowSearch(false)}
                    >
                      See all results for "{searchQuery}"
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Navigation Icons - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/feed"
            className="p-2.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="/friends"
            className="p-2.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <Users className="h-5 w-5" />
          </Link>
          <Link
            href="/messages"
            className="p-2.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground relative"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Link>
          <Link
            href="/notifications"
            className="p-2.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Link>
        </nav>

        {/* Theme Toggle & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            <ThemeIcon className="h-5 w-5" />
          </button>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name}
                />
                <AvatarFallback>
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-card border rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b">
                  <Link
                    href={`/profile/${user?.username}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                    onClick={() => setShowDropdown(false)}
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
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        View your profile
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="p-2">
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
