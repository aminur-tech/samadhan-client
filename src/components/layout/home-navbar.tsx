"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  ShieldAlert,
  Compass,
  LogOut,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Sparkles,
} from "lucide-react";

export function HomeNavbar() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(Boolean(session));
      setIsLoading(false);
    });

    // 2. Reactively listen for sign-in, sign-out, or session updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
            <Compass className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Samadhan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            Features
          </Link>


          <Link
            href="/dashboard/resume-matcher"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
           Resume Matcher
          </Link>
          {/* SOS Crisis Badge */}
          <Link
            href="/dashboard/crisis"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/10 dark:text-red-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>SOS Crisis</span>
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Dynamic Loading Skeleton */}
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 animate-pulse rounded-xl bg-muted/80" />
              <div className="h-9 w-20 animate-pulse rounded-xl bg-muted/80" />
            </div>
          ) : isAuthenticated ? (
            /* ================= LOGGED IN STATE ================= */
            <div className="flex items-center gap-2 border-l border-border/60 pl-3">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            /* ================= LOGGED OUT STATE ================= */
            <div className="flex items-center gap-2 border-l border-border/60 pl-3">
              {/* Login */}
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}