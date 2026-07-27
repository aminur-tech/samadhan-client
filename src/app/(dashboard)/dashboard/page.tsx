"use client";

import Link from "next/link";
import { useGetDecisionsQuery } from "@/store/api/decisionsApi";
import { useGetLegalCasesQuery } from "@/store/api/legalApi";
import { useGetCrisisReportsQuery } from "@/store/api/crisisApi";
import { Compass, Scale, ShieldAlert, ArrowUpRight, Plus } from "lucide-react";

export default function DashboardPage() {
  const { data: decisions, isLoading: isLoadingDecisions } = useGetDecisionsQuery({});
  const { data: legalCases, isLoading: isLoadingLegal } = useGetLegalCasesQuery({});
  const { data: crisisReports, isLoading: isLoadingCrisis } = useGetCrisisReportsQuery({});

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Track your AI workflows, decision models, and crisis reports.
          </p>
        </div>
        <Link
          href="/decisions"
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-1.5 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Decision
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-semibold">Decisions</span>
            <Compass className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">
            {isLoadingDecisions ? "..." : decisions?.length || 0}
          </p>
          <Link
            href="/decisions"
            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
          >
            View Matrix <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-semibold">Legal Cases</span>
            <Scale className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">
            {isLoadingLegal ? "..." : legalCases?.length || 0}
          </p>
          <Link
            href="/legal"
            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
          >
            View Cases <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card space-y-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-semibold">Crisis Logs</span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold">
            {isLoadingCrisis ? "..." : crisisReports?.length || 0}
          </p>
          <Link
            href="/crisis"
            className="text-xs text-red-500 font-medium flex items-center gap-1 hover:underline"
          >
            Checklist Status <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}