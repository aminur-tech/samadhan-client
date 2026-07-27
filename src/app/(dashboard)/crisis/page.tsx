"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  ListTodo,
  X,
  Loader2,
  Search,
  PhoneCall,
  Globe,
  CheckSquare,
  Square,
  ShieldCheck,
  Stethoscope,
  Lock,
  Landmark,
  Radio,
  ArrowRight,
} from "lucide-react";
import {
  useGetCrisisReportsQuery,
  useCreateCrisisReportMutation,
  useResolveCrisisMutation,
  CrisisReport,
} from "@/store/api/crisisApi";

// Category options matching backend `crisisCategoryEnum`
const CATEGORY_OPTIONS = [
  {
    id: "medical",
    label: "Medical Emergency",
    description: "Accidents, sudden critical illness, or urgent health crises.",
    icon: Stethoscope,
    badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    glowColor: "group-hover:shadow-rose-500/10 group-hover:border-rose-500/40",
    accentGlow: "from-rose-500/20 to-transparent",
  },
  {
    id: "cybercrime",
    label: "Cybercrime & Extortion",
    description: "Account takeovers, blackmail, online harassment, or data breaches.",
    icon: Lock,
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    glowColor: "group-hover:shadow-indigo-500/10 group-hover:border-indigo-500/40",
    accentGlow: "from-indigo-500/20 to-transparent",
  },
  {
    id: "financial_fraud",
    label: "Financial Fraud",
    description: "Unauthorized transactions, banking scams, or identity theft.",
    icon: Landmark,
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    glowColor: "group-hover:shadow-amber-500/10 group-hover:border-amber-500/40",
    accentGlow: "from-amber-500/20 to-transparent",
  },
] as const;

type CrisisCategory = (typeof CATEGORY_OPTIONS)[number]["id"];

// Emergency local helplines
const LOCAL_HELPLINES = [
  { name: "National Emergency Service", number: "999", tag: "24/7 Medical & Police" },
  { name: "Cyber Crime Helpline", number: "101", tag: "Cybercrime & Harassment" },
  { name: "Financial Fraud Hotline", number: "16236", tag: "Bangladesh Bank / Scams" },
];

export default function CrisisPage() {
  // RTK Query Hooks
  const { data: reports = [], isLoading, isError } = useGetCrisisReportsQuery(undefined);
  const [createCrisis, { isLoading: isCreating }] = useCreateCrisisReportMutation();
  const [resolveCrisis, { isLoading: isResolving }] = useResolveCrisisMutation();

  // Local UI State
  const [selectedReport, setSelectedReport] = useState<CrisisReport | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State matching CreateCrisisReportInput schema
  const [formData, setFormData] = useState<{
    category: CrisisCategory;
    description: string;
    language: "en" | "bn";
  }>({
    category: "medical",
    description: "",
    language: "en",
  });

  // Checklist Normalizer
  const parseChecklist = (checklist: unknown): string[] => {
    if (!checklist) return [];
    if (Array.isArray(checklist)) return checklist;
    if (typeof checklist === "string") {
      try {
        const parsed = JSON.parse(checklist);
        return Array.isArray(parsed) ? parsed : [checklist];
      } catch {
        return checklist.split("\n").filter((item) => item.trim().length > 0);
      }
    }
    return [];
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.description.length < 5) return;

    try {
      await createCrisis(formData).unwrap();
      setFormData({ category: "medical", description: "", language: "en" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to trigger emergency crisis action plan:", err);
    }
  };

  const handleToggleResolve = async (id: string, currentStatus: boolean) => {
    try {
      await resolveCrisis({ id, resolved: !currentStatus }).unwrap();
      if (selectedReport?.id === id) {
        setSelectedReport((prev) => (prev ? { ...prev, resolved: !prev.resolved } : null));
      }
    } catch (err) {
      console.error("Failed to update crisis status:", err);
    }
  };

  const toggleCheckstep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const openReportDetails = (report: CrisisReport) => {
    setSelectedReport(report);
    setCompletedSteps({});
  };

  const openSosModal = (category: CrisisCategory) => {
    setFormData((prev) => ({ ...prev, category }));
    setIsModalOpen(true);
  };

  // Filtering Logic
  const filteredReports = reports.filter((item: CrisisReport) => {
    const matchesFilter =
      filter === "all" ? true : filter === "active" ? !item.resolved : item.resolved;
    const matchesSearch =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = reports.filter((r: CrisisReport) => !r.resolved).length;
  const resolvedCount = reports.filter((r: CrisisReport) => r.resolved).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-10 font-sans selection:bg-rose-500/30 relative overflow-hidden transition-colors duration-300">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* HERO HEADER & SOS PANIC BAR */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-rose-950/20 group transition-colors duration-300">
          {/* Ambient Glow Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-rose-500/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-ping text-rose-500" />
                Emergency Action Protocol
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Real-Time <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 dark:from-rose-400 dark:via-rose-300 dark:to-indigo-300 bg-clip-text text-transparent">Crisis Mitigation</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Trigger an instant SOS response plan for critical emergencies. Receive step-by-step AI checklists alongside direct national helpline routes.
              </p>
            </div>

            {/* QUICK SOS BUTTON */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base shadow-xl shadow-rose-500/20 dark:shadow-2xl dark:shadow-rose-950/90 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 shrink-0 border border-rose-400/40 overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
              <AlertOctagon className="w-6 h-6 text-white animate-bounce shrink-0" />
              <span className="tracking-wide">TRIGGER SOS ACTION PLAN</span>
            </button>
          </div>
        </div>

        {/* LOCAL SUPPORT HELPLINES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              Immediate Emergency Helplines
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Toll-Free Direct Access</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LOCAL_HELPLINES.map((helpline) => (
              <a
                key={helpline.number}
                href={`tel:${helpline.number}`}
                className="group relative p-5 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/40 backdrop-blur-xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-rose-500/10"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{helpline.name}</p>
                  <p className="text-3xl font-black text-rose-600 dark:text-rose-400 group-hover:text-rose-500 transition-colors tracking-tight">
                    {helpline.number}
                  </p>
                  <span className="inline-block text-[10px] text-slate-500 dark:text-slate-500 font-medium bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50">
                    {helpline.tag}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-md">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CRISIS CATEGORY SHORTCUTS (Bento Cards) */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            Instant Category Response
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATEGORY_OPTIONS.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => openSosModal(cat.id)}
                  className={`cursor-pointer group relative p-6 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm hover:shadow-xl ${cat.glowColor}`}
                >
                  <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${cat.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3.5 rounded-xl border ${cat.badgeBg} shadow-inner`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
                        Launch SOS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INCIDENT MANAGEMENT SECTION */}
        <div className="space-y-6 pt-4">
          {/* STATS & FILTERING BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search emergency logs or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/50 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-1 gap-1">
                {(["all", "active", "resolved"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilter(mode)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter === mode
                        ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 dark:border-rose-500/30 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3 hidden md:flex items-center gap-3">
                <span>Active: <strong className="text-rose-600 dark:text-rose-400 font-bold">{activeCount}</strong></span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span>Resolved: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{resolvedCount}</strong></span>
              </div>
            </div>
          </div>

          {/* INCIDENTS LIST / GRID */}
          {isLoading ? (
            <div className="py-24 text-center space-y-4 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching critical incident logs...</p>
            </div>
          ) : isError ? (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-center text-sm font-medium">
              Unable to load crisis logs. Please verify backend API communication.
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Incidents Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs mx-auto">
                {searchQuery
                  ? "No logs match your filter criteria."
                  : "All clear! You currently have no active crisis logs."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report: CrisisReport) => {
                const checklistItems = parseChecklist(report.actionChecklist);
                const categoryDetails = CATEGORY_OPTIONS.find((c) => c.id === report.category);

                return (
                  <div
                    key={report.id}
                    className={`group relative flex flex-col justify-between rounded-2xl border backdrop-blur-xl transition-all duration-300 p-6 bg-white/80 dark:bg-slate-900/40 hover:-translate-y-1 shadow-sm hover:shadow-xl ${
                      report.resolved
                        ? "border-slate-200 dark:border-slate-800/80 opacity-75"
                        : "border-rose-200 dark:border-rose-900/30 hover:border-rose-500/50 hover:shadow-rose-500/10"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] font-bold capitalize text-slate-700 dark:text-slate-300">
                          {categoryDetails?.label || report.category.replace("_", " ")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            report.resolved
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse"
                          }`}
                        >
                          {report.resolved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" /> Active Incident
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
                        {report.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openReportDetails(report)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                      >
                        <ListTodo className="w-4 h-4" />
                        Action Plan ({checklistItems.length})
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleResolve(report.id, report.resolved)}
                        disabled={isResolving}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          report.resolved
                            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {report.resolved ? "Reopen" : "Resolve"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CREATE EMERGENCY CRISIS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-inner">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Trigger Emergency SOS</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Generate an AI-powered crisis mitigation plan</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Crisis Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as CrisisCategory })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Emergency Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the incident (e.g. Someone is demanding money using hacked photos, or patient has severe allergic reaction...)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Response Output Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "en" })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.language === "en"
                        ? "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "bn" })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.language === "bn"
                        ? "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/40 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed font-medium">
                  Submitting will instantly generate a structured mitigation checklist alongside official helpline contacts.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || formData.description.length < 5}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 dark:shadow-rose-950/80 transition-all disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating Plan...
                    </>
                  ) : (
                    "Submit Emergency Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MITIGATION CHECKLIST MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-500/20">
                  {selectedReport.category.replace("_", " ")}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">Emergency Action Plan</h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              <span className="text-slate-400 dark:text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">Reported Emergency:</span>
              {selectedReport.description}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recommended Action Steps
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Click to mark completed</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {parseChecklist(selectedReport.actionChecklist).map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheckstep(idx)}
                      className={`cursor-pointer flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/40 opacity-60 line-through text-slate-400 dark:text-slate-500"
                          : "bg-slate-50/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <button type="button" className="shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                      <p className="text-xs leading-relaxed">{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Status: <strong className={selectedReport.resolved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>{selectedReport.resolved ? "Resolved" : "Active Emergency"}</strong>
              </span>
              <button
                onClick={() => handleToggleResolve(selectedReport.id, selectedReport.resolved)}
                disabled={isResolving}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedReport.resolved
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-600/20 dark:shadow-emerald-950/50"
                }`}
              >
                {selectedReport.resolved ? "Reopen Incident" : "Mark Crisis Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}