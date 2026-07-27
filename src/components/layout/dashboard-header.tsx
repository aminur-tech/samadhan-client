"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AlertTriangle } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = "Overview" }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Workspace</span>
        <span>/</span>
        <span className="text-foreground font-medium">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/crisis"
          className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-500/20 transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          SOS Crisis Mode
        </Link>
      </div>
    </header>
  );
}