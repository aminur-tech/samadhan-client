"use client";

import Link from "next/link";
import { useGetDecisionsQuery } from "@/store/api/decisionsApi";
import { useGetLegalCasesQuery } from "@/store/api/legalApi";
import { useGetCrisisReportsQuery } from "@/store/api/crisisApi";
import { 
  Compass, 
  Scale, 
  ShieldAlert, 
  ArrowUpRight, 
  Plus, 
  TrendingUp, 
  Activity,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock trend data for the analytics chart
const analyticsData = [
  { month: "Jan", decisions: 12, legal: 8, crisis: 2 },
  { month: "Feb", decisions: 19, legal: 12, crisis: 4 },
  { month: "Mar", decisions: 15, legal: 10, crisis: 1 },
  { month: "Apr", decisions: 25, legal: 18, crisis: 5 },
  { month: "May", decisions: 32, legal: 22, crisis: 3 },
  { month: "Jun", decisions: 28, legal: 20, crisis: 2 },
];

export default function DashboardPage() {
  const { data: decisions, isLoading: isLoadingDecisions } = useGetDecisionsQuery(undefined);
  const { data: legalCases, isLoading: isLoadingLegal } = useGetLegalCasesQuery(undefined);
  const { data: crisisReports, isLoading: isLoadingCrisis } = useGetCrisisReportsQuery(undefined);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              Overview Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
            Monitor real-time workflow performance, decisions, and system alerts.
          </p>
        </div>

        <Link
          href="/decisions"
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-semibold shadow-md shadow-slate-900/10 dark:shadow-none transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span>New Decision</span>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Decisions Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-xl hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Decisions
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Compass className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-extrabold tracking-tight">
              {isLoadingDecisions ? (
                <span className="animate-pulse">...</span>
              ) : (
                decisions?.length || 0
              )}
            </p>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/60">
            <Link
              href="/decisions"
              className="group/link text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              View Matrix 
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Legal Cases Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-xl hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Legal Cases
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-extrabold tracking-tight">
              {isLoadingLegal ? (
                <span className="animate-pulse">...</span>
              ) : (
                legalCases?.length || 0
              )}
            </p>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +5%
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/60">
            <Link
              href="/legal"
              className="group/link text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
            >
              View Cases 
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Crisis Logs Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 shadow-sm backdrop-blur-xl hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500/80 dark:text-rose-400/80">
              Crisis Logs
            </span>
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
              {isLoadingCrisis ? (
                <span className="animate-pulse">...</span>
              ) : (
                crisisReports?.length || 0
              )}
            </p>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
              Action Req.
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-rose-200/40 dark:border-rose-900/40">
            <Link
              href="/crisis"
              className="group/link text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 transition-colors"
            >
              Checklist Status 
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Analytics Graph Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Activity Trends
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Volume analysis over the past 6 months
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-600 dark:text-zinc-400">Decisions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-zinc-400">Legal</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDecisions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLegal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                className="text-xs font-medium fill-slate-400 dark:fill-zinc-500"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                className="text-xs font-medium fill-slate-400 dark:fill-zinc-500"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(24, 24, 27, 0.85)', 
                  borderColor: 'rgba(63, 63, 70, 0.5)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="decisions" 
                stroke="#6366f1" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorDecisions)" 
              />
              <Area 
                type="monotone" 
                dataKey="legal" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorLegal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}