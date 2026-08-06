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
  ShieldCheck,
  FileSearch,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Checker", href: "/dashboard/resume-matcher", icon: FileSearch },
  { label: "Decision Matrix", href: "/dashboard/decisions", icon: Compass },
  { label: "Legal Navigator", href: "/dashboard/legal", icon: Scale },
  { label: "Crisis Support", href: "/dashboard/crisis", icon: AlertTriangle },
  { label: "Expert Panel", href: "/dashboard/experts", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border/70 bg-background/70 p-4 backdrop-blur-xl md:flex">
      <div className="flex w-full flex-col justify-between rounded-[24px] border border-border/80 bg-card/70 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)]">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Co-Pilot Life</p>
              <p className="text-xs text-muted-foreground">Command center</p>
            </div>
          </Link>

          <div className="rounded-[18px] border border-border/80 bg-background/70 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure workspace
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Trusted guidance, structured actions, and expert access in one place.
            </p>
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_10px_30px_-16px_rgba(79,70,229,0.6)]"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 border-t border-border/80 pt-4">
          <div className="flex items-center justify-between rounded-[16px] border border-border/80 bg-background/70 px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Samadhan User</p>
                <p className="text-xs text-muted-foreground">Logged in</p>
              </div>
            </div>
            <button className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}