"use client";

import Link from "next/link";
import { useGetDecisionsQuery } from "@/store/api/decisionsApi";
import { useGetLegalCasesQuery } from "@/store/api/legalApi";
import { useGetCrisisReportsQuery } from "@/store/api/crisisApi";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Plus,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const analyticsData = [
  { month: "Jan", decisions: 12, legal: 8, crisis: 2 },
  { month: "Feb", decisions: 19, legal: 12, crisis: 4 },
  { month: "Mar", decisions: 15, legal: 10, crisis: 1 },
  { month: "Apr", decisions: 25, legal: 18, crisis: 5 },
  { month: "May", decisions: 32, legal: 22, crisis: 3 },
  { month: "Jun", decisions: 28, legal: 20, crisis: 2 },
];

const recentActivity = [
  { title: "Legal brief reviewed", detail: "Three current files were updated" },
  { title: "Crisis checklist opened", detail: "High priority support path activated" },
  { title: "Decision matrix shared", detail: "Stakeholders received a new recommendation" },
];

const priorities = [
  { name: "Emergency review", status: "Needs action", type: "Crisis" },
  { name: "Document preparation", status: "In progress", type: "Legal" },
  { name: "Expert consultation", status: "Scheduled", type: "Panel" },
];

export default function DashboardPage() {
  const { data: decisions, isLoading: isLoadingDecisions } = useGetDecisionsQuery(undefined);
  const { data: legalCases, isLoading: isLoadingLegal } = useGetLegalCasesQuery(undefined);
  const { data: crisisReports, isLoading: isLoadingCrisis } = useGetCrisisReportsQuery(undefined);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="surface-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="chip">
              <Sparkles className="h-3.5 w-3.5" />
              Live command center
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Overview dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Monitor decisions, legal workflows, and urgent support channels from one elegant workspace.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/decisions"
            className="focus-ring inline-flex items-center gap-2 rounded-[12px] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_-12px_rgba(79,70,229,0.55)] transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            New decision
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Decisions</p>
              <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                <Compass className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-6 text-4xl font-black tracking-tight text-foreground">
              {isLoadingDecisions ? <span className="animate-pulse">...</span> : decisions?.length || 0}
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              +12% this month
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Legal cases</p>
              <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                <Scale className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-6 text-4xl font-black tracking-tight text-foreground">
              {isLoadingLegal ? <span className="animate-pulse">...</span> : legalCases?.length || 0}
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              +5% this month
            </div>
          </div>

          <div className="surface-card border-red-200/70 bg-red-500/[0.04] p-6 dark:border-red-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Crisis logs</p>
              <div className="rounded-2xl bg-red-500/10 p-2 text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-6 text-4xl font-black tracking-tight text-red-500">
              {isLoadingCrisis ? <span className="animate-pulse">...</span> : crisisReports?.length || 0}
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-red-500">
              <AlertCircle className="h-4 w-4" />
              Action required
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Quick actions</p>
              <p className="text-sm text-muted-foreground">Keep momentum in motion</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-2 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Link href="/dashboard/decisions" className="flex items-center justify-between rounded-[14px] border border-border/80 bg-background/70 p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <span>Open decision matrix</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/legal" className="flex items-center justify-between rounded-[14px] border border-border/80 bg-background/70 p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <span>Review legal guidance</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/crisis" className="flex items-center justify-between rounded-[14px] border border-border/80 bg-background/70 p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <span>Launch crisis checklist</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Activity trends</h2>
              <p className="text-sm text-muted-foreground">Volume across the last six months</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Decisions</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Legal</span>
            </div>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="decisionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="legalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.92)",
                    borderColor: "rgba(148, 163, 184, 0.18)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                  }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Area type="monotone" dataKey="decisions" stroke="#6366f1" strokeWidth={2.5} fill="url(#decisionsGradient)" />
                <Area type="monotone" dataKey="legal" stroke="#38bdf8" strokeWidth={2} fill="url(#legalGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
              <p className="text-sm text-muted-foreground">Most recent updates in your workspace</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-[14px] border border-border/80 bg-background/70 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item.title}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Open priorities</h2>
            <p className="text-sm text-muted-foreground">A concise view of pending follow-ups</p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-[16px] border border-border/80">
          <table className="min-w-full divide-y divide-border/80 text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80 bg-background/60 text-foreground">
              {priorities.map((item) => (
                <tr key={item.name} className="transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}