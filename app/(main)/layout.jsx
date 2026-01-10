"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Loader2 } from "lucide-react";

export default function MainLayout({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex max-w-360 mx-auto w-11/12">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0">
          {children}
        </main>

        <RightSidebar />
      </div>

      <MobileNav />
    </div>
  );
}
