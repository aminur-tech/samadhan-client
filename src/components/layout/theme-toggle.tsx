"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  // `resolvedTheme` is guaranteed to be 'light' or 'dark' on the client.
  const { resolvedTheme, setTheme } = useTheme();

  // resolvedTheme is undefined during SSR and during the initial client render
  // before next-themes has determined the actual theme.
  if (resolvedTheme === undefined) {
    // Render a placeholder or a default theme icon on the server and during initial client render
    // until next-themes has determined the actual theme.
    // This prevents hydration mismatches by ensuring consistent server-side rendering.
    return (
      <button
        className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center text-foreground"
        aria-label="Toggle theme"
      >
        {/* Default to Sun icon as a neutral placeholder */}
        <Sun className="h-4 w-4 text-amber-400" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center text-foreground"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </button>
  );
}