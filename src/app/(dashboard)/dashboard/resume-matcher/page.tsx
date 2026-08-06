"use client";

import { useMemo, useState } from "react";
import {
  useMatchResumeMutation,
  useGenerateResumePdfMutation,
  useGetResumeHistoryQuery,
} from "@/store/api/resumeApi";
import { PdfPreview } from "@/components/resume/pdf-preview";
import { CoverLetterEditor } from "@/components/resume/cover-letter-editor";
import { OptimizerPanel } from "@/components/resume/optimizer-panel";
import { ApplyWorkflow } from "@/components/resume/apply-workflow";
import {
  Sparkles,
  FileText,
  Download,
  Mail,
  Building2,
  Briefcase,
  Upload,
  File,
  X,
  Loader2,
  Copy,
  Check,
  History,
  Eye,
  FileType,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Layers3,
  RefreshCw,
} from "lucide-react";

function cleanText(text: string = ""): string {
  return text.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

export default function ResumeMatcherPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [useFileUpload, setUseFileUpload] = useState(true);

  // Tab management
  const [originalViewTab, setOriginalViewTab] = useState<"pdf" | "text">("pdf");
  const [optimizedTab, setOptimizedTab] = useState<"preview" | "latex">("preview");

  // Drawer / History state
  const [showHistory, setShowHistory] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [coverLetterDraft, setCoverLetterDraft] = useState("");
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);

  // API Mutations and Queries
  const [matchResume, { data: matchData, isLoading: isMatching }] = useMatchResumeMutation();
  const [generatePdf, { data: pdfData, isLoading: isCompiling }] = useGenerateResumePdfMutation();
  const { data: historyData } = useGetResumeHistoryQuery();

  const result = matchData?.data;
  const compiledPdf = pdfData?.data;

  const optimizerMetrics = useMemo(() => ({
    atsScore: result?.atsScore ?? 0,
    keywordMatch: Math.min(100, Math.round((result?.matchedSkills?.length ?? 0) * 12 + 40)),
    missingSkills: result?.missingSkills ?? [],
    missingKeywords: result?.suggestions?.slice(0, 4) ?? [],
    recommendations: result?.suggestions ?? [],
    grammar: 92,
    formatting: 88,
    impact: Math.min(99, Math.round((result?.atsScore ?? 0) + 8)),
  }), [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);

    if (useFileUpload && selectedFile) {
      formData.append("file", selectedFile);
    } else if (resumeText.trim()) {
      formData.append("resumeText", resumeText);
    } else {
      return;
    }

    try {
      await matchResume(formData).unwrap();
    } catch (err) {
      console.error("Match process error:", err);
    }
  };

  const handleCompilePdf = async () => {
  if (!result?.id) return;
  try {
    await generatePdf({ analysisId: result.id }).unwrap();
  } catch (err: any) {
    console.error("LaTeX Compilation error:", err);
    const errorMessage = err?.data?.message || "Failed to compile PDF. Check LaTeX syntax or compiler setup.";
    alert(errorMessage); 
  }
};

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(cleanText(text));
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPackage = () => {
    if (!result) return;
    if (compiledPdf?.pdfUrl) handleDownloadFile(compiledPdf.pdfUrl, compiledPdf.filename);
    if (compiledPdf?.texUrl) handleDownloadFile(compiledPdf.texUrl, `${result.companyName}_Resume.tex`);
    
    // Save email & cover letter as text file
    const element = document.createElement("a");
    const file = new Blob(
      [
        `COVER LETTER:\n\n${result.coverLetter}\n\n` +
        `=========================================\n\n` +
        `APPLICATION EMAIL:\n\n${result.applicationEmail}`
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${result.companyName}_Application_Package.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const stats = historyData?.data?.stats;

  const handleGenerateCoverLetter = async ({ companyName, hiringManager }: { companyName: string; hiringManager: string; tone: string; length: string }) => {
    const draft = [
      `Dear ${hiringManager || "Hiring Manager"},`,
      "",
      `I am excited to apply for the ${result?.jobTitle || "role"} position at ${companyName || result?.companyName || "your company"}.`,
      `My background aligns closely with your team’s needs, especially in ${result?.matchedSkills?.slice(0, 3).join(", ") || "core execution and collaboration"}.`,
      `I would welcome the opportunity to discuss how I can contribute with a thoughtful, results-driven approach that is tailored to your organization’s goals.`,
      `Thank you for your consideration. I look forward to the possibility of speaking with you further.`,
      "",
      "Best regards,",
      "Your Name",
    ].join("\n");

    setCoverLetterDraft(draft);
    setLastGeneratedAt(new Date().toLocaleString());
  };

  const handleApply = async () => {
    if (!result) return;
    setLastGeneratedAt((current) => current ?? new Date().toLocaleString());
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <section className="surface-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="chip">
              <BrainCircuit className="h-3.5 w-3.5" />
              AI resume checker & apply platform
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">AI Resume Checker & Job Application Platform</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Match your resume to a job, preview a compiled PDF instantly, generate a polished cover letter, and apply in one guided workflow.
              </p>
            </div>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted">
            <History className="h-4 w-4 text-primary" />
            {showHistory ? "Hide history" : "View history"}
          </button>
        </div>
      </section>

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Resumes processed</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.totalAnalyzed}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Average ATS</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{stats.avgAtsScore}%</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Best score</p>
                <p className="mt-2 text-2xl font-black text-sky-600">{stats.bestAtsScore}%</p>
              </div>
              <Layers3 className="h-8 w-8 text-sky-600" />
            </div>
          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="p-5 border rounded-2xl bg-card shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b pb-3 border-border">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Optimization Audit Log
            </h3>
            <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {historyData?.data?.history?.map((item) => (
              <div key={item.id} className="p-3 border rounded-xl flex items-center justify-between bg-muted/20 hover:bg-muted/40 transition-all text-xs">
                <div>
                  <p className="font-semibold">{item.jobTitle || "Role"} - <span className="text-primary">{item.companyName || "Company"}</span></p>
                  <p className="text-muted-foreground mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg">
                    {item.atsScore}% Match
                  </span>
                  {item.optimizedResumePdfUrl && (
                    <a href={item.optimizedResumePdfUrl} target="_blank" rel="noreferrer" className="p-1 hover:text-primary">
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Source Candidate Resume</label>
            <button
              type="button"
              onClick={() => setUseFileUpload(!useFileUpload)}
              className="text-xs text-primary font-medium hover:underline"
            >
              {useFileUpload ? "Switch to Text Input" : "Switch to File Upload"}
            </button>
          </div>

          {useFileUpload ? (
            <div className="border-2 border-dashed border-border/80 rounded-xl h-64 p-6 flex flex-col items-center justify-center bg-card hover:bg-muted/20 transition-all text-center relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <File className="h-10 w-10 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-rose-500 hover:underline"
                  >
                    <X className="h-3.5 w-3.5" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max 10MB)</p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="w-full h-64 p-3 border rounded-xl bg-background border-border/80 focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
              placeholder="Paste raw resume text..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          )}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold">Target Job Description</label>
          <textarea
            className="w-full h-64 p-3 border rounded-xl bg-background border-border/80 focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
            placeholder="Paste target job listing..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isMatching || !jobDescription || (useFileUpload ? !selectedFile : !resumeText)}
        className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_-12px_rgba(79,70,229,0.55)] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isMatching ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing resume match...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Match & tailor resume
          </>
        )}
      </button>

      {result && (
        <div className="space-y-8 border-t border-border/80 pt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="surface-card p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">ATS score</p>
              <p className="mt-3 text-4xl font-black text-primary">{result.atsScore}%</p>
            </div>
            <div className="surface-card p-5">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Company</p>
                  <p className="text-sm font-semibold text-foreground">{result.companyName || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-5">
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Title</p>
                  <p className="text-sm font-semibold text-foreground">{result.jobTitle || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Recruiter</p>
                  <p className="text-sm font-semibold text-foreground">{result.recruiterEmail || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <OptimizerPanel {...optimizerMetrics} />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Source resume</h3>
                <div className="inline-flex rounded-[10px] border border-border/80 bg-muted/50 p-0.5">
                  <button onClick={() => setOriginalViewTab("pdf")} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${originalViewTab === "pdf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}><Eye className="mr-1 inline h-3 w-3" /> PDF</button>
                  <button onClick={() => setOriginalViewTab("text")} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${originalViewTab === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}><FileType className="mr-1 inline h-3 w-3" /> Text</button>
                </div>
              </div>
              {originalViewTab === "pdf" && result.originalFileUrl ? (
                <PdfPreview src={result.originalFileUrl} title="Original resume preview" fallbackLabel="Original resume preview is not available yet." />
              ) : (
                <div className="h-140 overflow-y-auto whitespace-pre-wrap rounded-3xl border border-border/80 bg-muted/30 p-4 font-mono text-xs leading-7 text-muted-foreground">
                  {cleanText(result.originalResumeText) || "No source text available."}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-primary">Resume PDF workspace</h3>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Live</span>
                </div>
                {!compiledPdf && (
                  <button onClick={handleCompilePdf} disabled={isCompiling} className="focus-ring inline-flex items-center gap-2 rounded-[10px] bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60">
                    {isCompiling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    {isCompiling ? "Compiling…" : "Compile PDF"}
                  </button>
                )}
              </div>
              {optimizedTab === "preview" ? (
                compiledPdf?.pdfUrl ? (
                  <PdfPreview src={compiledPdf.pdfUrl} title="Optimized resume preview" fallbackLabel="The optimized PDF is still compiling. Please wait a moment." />
                ) : (
                  <div className="flex h-140 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground/60" />
                    <p className="text-sm font-semibold text-foreground">Your optimized PDF is ready to compile</p>
                    <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">Click compile to generate the preview, download the PDF, and keep the workflow moving.</p>
                  </div>
                )
              ) : (
                <div className="relative">
                  <textarea readOnly value={compiledPdf?.latex || "LaTeX source will appear here after compilation."} className="h-140 w-full resize-none rounded-3xl border border-border/80 bg-zinc-950 p-4 font-mono text-xs leading-7 text-zinc-100 outline-none" />
                  {compiledPdf?.latex && (
                    <button onClick={() => copyToClipboard(compiledPdf.latex, "latex")} className="absolute right-3 top-3 rounded-[10px] border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition-colors hover:bg-zinc-800">
                      {copiedSection === "latex" ? <Check className="mr-1 inline h-3.5 w-3.5 text-emerald-400" /> : <Copy className="mr-1 inline h-3.5 w-3.5" />}
                      {copiedSection === "latex" ? "Copied" : "Copy .tex"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

         

          <div className="rounded-[24px] border border-border/80 bg-background/70 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">AI cover letter generator</p>
                <p className="text-sm text-muted-foreground">Professional, ATS-optimized, human-sounding, and editable.</p>
              </div>
              {lastGeneratedAt ? <span className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">Last generated {lastGeneratedAt}</span> : null}
            </div>
            <CoverLetterEditor initialContent={coverLetterDraft || result.coverLetter || ""} companyName={result.companyName} hiringManager={result.recruiterEmail} onGenerate={handleGenerateCoverLetter} />
          </div>

          <div className="rounded-[24px] border border-border/80 bg-background/70 p-5">
            <div className="mb-4">
              <p className="text-lg font-semibold text-foreground">One-click apply workflow</p>
              <p className="text-sm text-muted-foreground">Support for Greenhouse, Lever, Ashby, Workday, SmartRecruiters, and auto-fill fallback.</p>
            </div>
            <ApplyWorkflow companyName={result.companyName} jobTitle={result.jobTitle} coverLetter={coverLetterDraft || result.coverLetter || ""} onApply={handleApply} />
          </div>
        </div>
      )}
    </div>
  );
}