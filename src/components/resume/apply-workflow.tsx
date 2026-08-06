"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Send, Sparkles, Briefcase, FileText, MessageSquareText } from "lucide-react";

interface ApplyWorkflowProps {
  companyName?: string;
  jobTitle?: string;
  coverLetter?: string;
  onApply?: () => Promise<void>;
}

export function ApplyWorkflow({ companyName = "", jobTitle = "", coverLetter = "", onApply }: ApplyWorkflowProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [selectedProvider, setSelectedProvider] = useState("Generic");

  const providers = useMemo(() => ["Greenhouse", "Lever", "Ashby", "Workday", "SmartRecruiters", "Generic"], []);

  const handleApply = async () => {
    setStatus("submitting");
    try {
      await onApply?.();
      setStatus("success");
    } finally {
      setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[20px] border border-border/80 bg-background/70 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Send className="h-4 w-4 text-primary" />
          One-click apply
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-[16px] border border-border/80 bg-card p-4">
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="mt-1 font-semibold text-foreground">{companyName || "Target employer"}</p>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-card p-4">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-1 font-semibold text-foreground">{jobTitle || "Target role"}</p>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-card p-4">
            <p className="text-sm text-muted-foreground">Provider</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {providers.map((provider) => (
                <button key={provider} type="button" onClick={() => setSelectedProvider(provider)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${selectedProvider === provider ? "border-primary bg-primary/10 text-primary" : "border-border/80 bg-background/70 text-muted-foreground"}`}>
                  {provider}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleApply} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5">
            <Sparkles className="h-4 w-4" />
            Apply with package
          </button>
        </div>
      </div>

      <div className="rounded-[20px] border border-border/80 bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          Application package
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Resume + cover letter
            </div>
            <p className="mt-2">Your generated materials are staged for the selected provider and will be submitted with a tracked status.</p>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MessageSquareText className="h-4 w-4 text-primary" />
              Questions and prompts
            </div>
            <p className="mt-2">The workflow supports browser autofill fallback, application history, and provider-specific routing where available.</p>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Status tracking
            </div>
            <p className="mt-2">Applied, Interview, Rejected, and Offer states are preserved in your application history.</p>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/70 p-4 text-sm">
            <span className="font-semibold text-foreground">Selected provider</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {selectedProvider}
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
