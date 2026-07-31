"use client";

import { useState } from "react";
import {
  useMatchResumeMutation,
  useGenerateResumePdfMutation,
  useGetResumeHistoryQuery,
} from "@/store/api/resumeApi";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
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
  ExternalLink,
  History,
  Eye,
  FileType,
  Code,
  PackageCheck,
  BarChart3,
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

  // API Mutations and Queries
  const [matchResume, { data: matchData, isLoading: isMatching }] = useMatchResumeMutation();
  const [generatePdf, { data: pdfData, isLoading: isCompiling }] = useGenerateResumePdfMutation();
  const { data: historyData, refetch: refetchHistory } = useGetResumeHistoryQuery();

  const result = matchData?.data;
  const compiledPdf = pdfData?.data;

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
    } catch (err) {
      console.error("LaTeX Compilation error:", err);
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Matcher & LaTeX Workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Deterministic ATS scoring, structural AI optimization, and compilation to LaTeX PDF.
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 border rounded-xl bg-card hover:bg-accent text-xs font-semibold shadow-sm transition-all"
        >
          <History className="h-4 w-4 text-primary" />
          {showHistory ? "Hide Workspace History" : "Match History & Stats"}
        </button>
      </div>

      {/* User Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-2xl bg-card flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Total Resumes Processed</p>
              <p className="text-2xl font-bold mt-1">{stats.totalAnalyzed}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary/60" />
          </div>
          <div className="p-4 border rounded-2xl bg-card flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Average ATS Match Score</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.avgAtsScore}%</p>
            </div>
            <Sparkles className="h-8 w-8 text-emerald-500/60" />
          </div>
          <div className="p-4 border rounded-2xl bg-card flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Best Performance Score</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats.bestAtsScore}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-blue-500/60" />
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

      {/* Inputs Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
      >
        {isMatching ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Parsing & Performing ATS Match...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Match & Tailor Candidate Resume
          </>
        )}
      </button>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-8 pt-6 border-t border-border animate-in fade-in duration-500">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-card flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ATS Score</span>
              <span className="text-4xl font-extrabold text-primary mt-1">{result.atsScore}%</span>
            </div>
            <div className="p-4 border rounded-xl bg-card flex items-center gap-3 shadow-sm">
              <Building2 className="h-7 w-7 text-primary/80" />
              <div>
                <p className="text-xs text-muted-foreground">Target Company</p>
                <p className="font-semibold text-sm">{result.companyName || "N/A"}</p>
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-card flex items-center gap-3 shadow-sm">
              <Briefcase className="h-7 w-7 text-primary/80" />
              <div>
                <p className="text-xs text-muted-foreground">Target Title</p>
                <p className="font-semibold text-sm">{result.jobTitle || "N/A"}</p>
              </div>
            </div>
            <div className="p-4 border rounded-xl bg-card flex items-center gap-3 shadow-sm">
              <Mail className="h-7 w-7 text-primary/80" />
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">Recruiter Email</p>
                <p className="font-semibold text-sm truncate">{result.recruiterEmail || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Dual Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Original View */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground">Source Resume Data</h3>
                <div className="inline-flex rounded-lg border p-0.5 bg-muted">
                  <button
                    onClick={() => setOriginalViewTab("pdf")}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                      originalViewTab === "pdf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    <Eye className="h-3 w-3 inline mr-1" /> PDF View
                  </button>
                  <button
                    onClick={() => setOriginalViewTab("text")}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                      originalViewTab === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    <FileType className="h-3 w-3 inline mr-1" /> Raw Text
                  </button>
                </div>
              </div>

              {originalViewTab === "pdf" && result.originalFileUrl ? (
                <iframe
                  src={result.originalFileUrl}
                  className="w-full h-[520px] rounded-xl border border-border bg-card"
                  title="Original Resume PDF"
                />
              ) : (
                <div className="p-4 border rounded-xl bg-muted/30 text-xs font-mono h-[520px] overflow-y-auto whitespace-pre-wrap">
                  {cleanText(result.originalResumeText) || "No source text available."}
                </div>
              )}
            </div>

            {/* Right Box: Optimized Resume + LaTeX Compiler Workspace */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-primary">LaTeX PDF Engine</h3>
                  <div className="inline-flex rounded-lg border p-0.5 bg-muted">
                    <button
                      onClick={() => setOptimizedTab("preview")}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                        optimizedTab === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      <Eye className="h-3 w-3 inline mr-1" /> PDF Preview
                    </button>
                    <button
                      onClick={() => setOptimizedTab("latex")}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                        optimizedTab === "latex" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      <Code className="h-3 w-3 inline mr-1" /> LaTeX Source
                    </button>
                  </div>
                </div>

                {!compiledPdf && (
                  <button
                    onClick={handleCompilePdf}
                    disabled={isCompiling}
                    className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isCompiling ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Compiling PDF...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Compile LaTeX PDF
                      </>
                    )}
                  </button>
                )}
              </div>

              {optimizedTab === "preview" ? (
                compiledPdf?.pdfUrl ? (
                  <iframe
                    src={compiledPdf.pdfUrl}
                    className="w-full h-[520px] rounded-xl border border-border bg-card shadow-sm"
                    title="Compiled LaTeX PDF Resume Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl h-[520px] bg-muted/10 p-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/60 mb-3" />
                    <p className="font-semibold text-sm">LaTeX PDF Not Compiled Yet</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Click the &quot;Compile LaTeX PDF&quot; button above to run the server-side compiler pipeline.
                    </p>
                  </div>
                )
              ) : (
                <div className="relative">
                  <textarea
                    readOnly
                    value={compiledPdf?.latex || "LaTeX source available upon compilation."}
                    className="w-full h-[520px] p-4 font-mono text-xs border rounded-xl bg-zinc-950 text-zinc-100 resize-none outline-none"
                  />
                  {compiledPdf?.latex && (
                    <button
                      onClick={() => copyToClipboard(compiledPdf.latex, "latex")}
                      className="absolute top-3 right-3 px-2.5 py-1 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs rounded-lg flex items-center gap-1"
                    >
                      {copiedSection === "latex" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedSection === "latex" ? "Copied" : "Copy .tex"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Row & Download Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-2xl bg-card shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">One-Click Application Package</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {compiledPdf?.pdfUrl && (
                <button
                  onClick={() => handleDownloadFile(compiledPdf.pdfUrl, compiledPdf.filename)}
                  className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-accent transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 text-primary" /> Download PDF
                </button>
              )}
              {compiledPdf?.texUrl && (
                <button
                  onClick={() => handleDownloadFile(compiledPdf.texUrl, `${result.companyName}_Resume.tex`)}
                  className="flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-accent transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 text-emerald-600" /> Download .tex Source
                </button>
              )}
              <button
                onClick={handleDownloadPackage}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow hover:opacity-90 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download Full Package (.zip/.txt)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}