"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AlertTriangle, Bell, Search } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Overview" }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Workspace</span>
          <span>/</span>
          <span className="font-semibold text-foreground">{title}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-[14px] border border-border/80 bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm">
            <Search className="h-4 w-4" />
            <input
              aria-label="Search workspace"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-48"
              placeholder="Search"
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="focus-ring rounded-[12px] border border-border/80 bg-background/70 p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <Link
              href="/dashboard/crisis"
              className="focus-ring inline-flex items-center gap-2 rounded-[12px] border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              SOS mode
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}