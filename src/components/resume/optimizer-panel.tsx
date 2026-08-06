"use client";

import { BarChart3 } from "lucide-react";

interface OptimizerPanelProps {
  atsScore?: number;
  keywordMatch?: number;
  missingSkills?: string[];
  missingKeywords?: string[];
  recommendations?: string[];
  grammar?: number;
  formatting?: number;
  impact?: number;
}

const scoreColor = (score: number) => {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-rose-600";
};

export function OptimizerPanel({ atsScore = 0, keywordMatch = 0, missingSkills = [], missingKeywords = [], recommendations = [], grammar = 0, formatting = 0, impact = 0 }: OptimizerPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4 rounded-[20px] border border-border/80 bg-background/70 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          ATS intelligence
        </div>
        <div className="rounded-[16px] border border-border/80 bg-card p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ATS score</p>
              <p className={`text-4xl font-black ${scoreColor(atsScore)}`}>{atsScore}%</p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Optimized</div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${atsScore}%` }} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[16px] border border-border/80 bg-card p-4">
            <p className="text-sm text-muted-foreground">Keyword match</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{keywordMatch}%</p>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-card p-4">
            <p className="text-sm text-muted-foreground">Impact score</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{impact}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-[20px] border border-border/80 bg-card p-5">
        <div className="space-y-3">
          {[
            { label: "Grammar", value: grammar },
            { label: "Formatting", value: formatting },
            { label: "Keyword density", value: keywordMatch },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>{item.label}</span>
                <span className="font-semibold text-foreground">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">Missing skills</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {missingSkills.length ? missingSkills.map((skill) => <li key={skill}>• {skill}</li>) : <li>None detected</li>}
            </ul>
          </div>
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">Missing keywords</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {missingKeywords.length ? missingKeywords.map((keyword) => <li key={keyword}>• {keyword}</li>) : <li>All priority keywords found</li>}
            </ul>
          </div>
        </div>

        <div className="rounded-[16px] border border-border/80 bg-background/70 p-4">
          <p className="text-sm font-semibold text-foreground">Recommendations</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {recommendations.length ? recommendations.map((recommendation) => <li key={recommendation}>• {recommendation}</li>) : <li>Strengthen quantifiable achievements and leadership phrasing.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
