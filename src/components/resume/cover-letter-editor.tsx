"use client";

import { useMemo, useState } from "react";
import { Copy, Download, FileText, RefreshCw, Sparkles, Wand2 } from "lucide-react";

interface CoverLetterEditorProps {
  initialContent?: string;
  companyName?: string;
  hiringManager?: string;
  onGenerate?: (payload: { companyName: string; hiringManager: string; tone: string; length: string }) => Promise<void>;
}

export function CoverLetterEditor({ initialContent = "", companyName = "", hiringManager = "", onGenerate }: CoverLetterEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [company, setCompany] = useState(companyName);
  const [manager, setManager] = useState(hiringManager);
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => content.split(/\s+/).filter(Boolean).length, [content]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate?.({ companyName: company, hiringManager: manager, tone, length });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 rounded-[20px] border border-border/80 bg-background/70 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wand2 className="h-4 w-4 text-primary" />
          AI cover letter studio
        </div>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Company</span>
            <input value={company} onChange={(event) => setCompany(event.target.value)} className="focus-ring w-full rounded-[12px] border border-border/80 bg-card px-3 py-2.5 text-sm outline-none" placeholder="Acme Labs" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Hiring manager</span>
            <input value={manager} onChange={(event) => setManager(event.target.value)} className="focus-ring w-full rounded-[12px] border border-border/80 bg-card px-3 py-2.5 text-sm outline-none" placeholder="Jordan Kim" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Tone</span>
              <select value={tone} onChange={(event) => setTone(event.target.value)} className="focus-ring w-full rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm outline-none">
                <option value="professional">Professional</option>
                <option value="confident">Confident</option>
                <option value="warm">Warm</option>
                <option value="concise">Concise</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Length</span>
              <select value={length} onChange={(event) => setLength(event.target.value)} className="focus-ring w-full rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm outline-none">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
          </div>
        </div>
        <button type="button" onClick={handleGenerate} disabled={isGenerating} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60">
          {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate cover letter
        </button>
      </div>

      <div className="rounded-[20px] border border-border/80 bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Editable draft</p>
            <p className="text-xs text-muted-foreground">ATS-optimized, human-sounding, and ready to refine</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">{wordCount} words</span>
            <button type="button" onClick={copyToClipboard} className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted">
              <Copy className="h-4 w-4" />
            </button>
            <button type="button" className="focus-ring rounded-[10px] border border-border/80 bg-background/70 p-2 text-muted-foreground hover:bg-muted">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} className="focus-ring min-h-[320px] w-full rounded-[16px] border border-border/80 bg-background/70 p-4 text-sm leading-7 text-foreground outline-none" placeholder="Your generated cover letter will appear here" />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{copied ? "Copied to clipboard" : "Copy, refine, or export when you’re ready"}</span>
          <span className="inline-flex items-center gap-1 text-primary"><FileText className="h-3.5 w-3.5" /> Ready for apply</span>
        </div>
      </div>
    </div>
  );
}
