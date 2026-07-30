"use client";

import React, { useState } from "react";
import {
    useGetLegalCasesQuery,
    useCreateLegalCaseMutation
} from "@/store/api/legalApi";
import {
    Scale,
    ShieldCheck,
    MessageCircle,
    Video,
    Plus,
    FileText,
    Loader2,
    ArrowRight,
    Briefcase,
    AlertCircle
} from "lucide-react";

type LegalCase = {
    id: string | number;
    caseType: string;
    description: string;
};

type CreateCasePayload = {
    caseType: string;
    description: string;
    language: string;
};

type ApiError = {
    data: {
        details?: {
            description?: string[];
        };
        error?: string;
    };
    status: number;
};

export default function LegalPage() {
    const { data: cases, isLoading: isLoadingCases } = useGetLegalCasesQuery({});
    const [createCase, { isLoading: isCreating }] = useCreateLegalCaseMutation();

    // Form State
    const [caseType, setCaseType] = useState("GENERAL");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        // Client-side validation: must meet backend 10-char minimum
        if (description.trim().length < 10) {
            setErrorMessage("Please describe the issue in more detail (at least 10 characters).");
            return;
        }

        try {
            const payload: CreateCasePayload = { caseType, description, language: "en" };
            await createCase(payload).unwrap();
            setDescription(""); // Reset form on success
        } catch (err) {
            console.error("Failed to create case:", err);
            // Extract backend error message if available
            const apiError = err as ApiError;
            const backendMessage =
                apiError?.data?.details?.description?.[0] ||
                apiError?.data?.error ||
                "Failed to submit case. Please try again.";
            setErrorMessage(backendMessage);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto transition-colors duration-300">

            {/* Header Section */}
            <div className="pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        <Scale className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                            Legal Center
                        </h1>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
                            Manage your legal cases and consult with certified professionals.
                        </p>
                    </div>
                </div>
            </div>

            {/* Verified Expert Panel Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 pointer-events-none">
                    <ShieldCheck className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Verified Expert Panel
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Human-in-the-Loop Consultation
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400">
                            Need immediate guidance? Connect directly with certified lawyers, career counselors, and financial planners.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-zinc-200 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            Live Chat
                        </button>
                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                            <Video className="w-4 h-4" />
                            Book Video Session
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Case List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-slate-400" /> Active Cases
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                            {cases?.length || 0} Total
                        </span>
                    </div>

                    {isLoadingCases ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 rounded-2xl bg-slate-200/50 dark:bg-zinc-800/50 animate-pulse" />
                            ))}
                        </div>
                    ) : cases?.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
                            <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No active legal cases</p>
                            <p className="text-sm">Submit a new case to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cases?.map((c: LegalCase, idx: number) => (
                                <div
                                    key={c.id || idx}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 shadow-sm backdrop-blur-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                    {c.caseType}
                                                </span>
                                                <span className="text-xs text-slate-400 dark:text-zinc-500">Just now</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-zinc-300 line-clamp-2 mt-2">
                                                {c.description}
                                            </p>
                                        </div>
                                        <div className="p-2 rounded-full bg-slate-50 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Create Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-500" /> Open New Case
                        </h3>

                        <form onSubmit={handleCreateCase} className="space-y-4">
                            {/* Validation Error Alert */}
                            {errorMessage && (
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/50">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                    Case Type
                                </label>
                                <select
                                    value={caseType}
                                    onChange={(e) => setCaseType(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all dark:text-zinc-200"
                                >
                                    <option value="GENERAL">General Consultation</option>
                                    <option value="CORPORATE">Corporate Law</option>
                                    <option value="FAMILY">Family Law</option>
                                    <option value="INTELLECTUAL_PROPERTY">Intellectual Property</option>
                                    <option value="CRIMINAL">Criminal Defense</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Description
                                    </label>
                                    <span
                                        className={`text-[10px] ${
                                            description.length > 0 && description.length < 10
                                                ? "text-red-500 font-semibold"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {description.length}/10 min chars
                                    </span>
                                </div>
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (errorMessage) setErrorMessage(null);
                                    }}
                                    placeholder="Provide details about your situation (min. 10 characters)..."
                                    rows={4}
                                    minLength={10}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating || description.trim().length < 10}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-sm font-semibold shadow-md shadow-slate-900/10 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Case
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}