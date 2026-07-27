"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  Scale,
  AlertTriangle,
  Users,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Decision Matrix", href: "/decisions", icon: Compass },
  { label: "Legal Navigator", href: "/legal", icon: Scale },
  { label: "Crisis Support", href: "/crisis", icon: AlertTriangle },
  { label: "Expert Panel", href: "/experts", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-muted/20 flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl px-2">
          <Compass className="h-6 w-6 text-primary" />
          <span>Co-Pilot Life</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="border-t border-border pt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            S
          </div>
          <div className="text-xs">
            <p className="font-semibold leading-none">Samadhan User</p>
            <p className="text-muted-foreground leading-tight mt-1">Logged In</p>
          </div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}