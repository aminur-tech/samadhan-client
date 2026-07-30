"use client"

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Globe2, 
  ThumbsUp, 
  ThumbsDown, 
  Award, 
  RotateCcw,
  Lightbulb,
  History,
  X,
  ChevronRight,
  Clock
} from 'lucide-react';
import { 
  useCreateDecisionMutation, 
  useGetDecisionsQuery // Ensure this endpoint exists in your RTK Query API slice
} from '@/store/api/decisionsApi';

// Type definitions matching your backend JSON output
interface OptionDetail {
  name: string;
  pros: string[];
  cons: string[];
  confidenceScore: number;
}

interface StructuredAIResult {
  options: OptionDetail[];
  recommendation: string;
  reasoning: string;
}

export interface DecisionItem {
  id?: string;
  _id?: string;
  problemStatement: string;
  options?: string[];
  language?: string;
  aiResult: string | StructuredAIResult;
  createdAt?: string;
}

const DecisionPage = () => {
  const [problemStatement, setProblemStatement] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [result, setResult] = useState<DecisionItem | null>(null);
  const [formError, setFormError] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // RTK Query Hooks
  const [createDecision, { isLoading: isCreating }] = useCreateDecisionMutation();
  const { data: historyData, isLoading: isLoadingHistory } = useGetDecisionsQuery(undefined);

  // Type guard to check for the { data: [...] } structure which can be returned by the API
  const isDataWrapper = (obj: unknown): obj is { data: DecisionItem[] } => {
    return !!obj && typeof obj === 'object' && 'data' in obj && Array.isArray((obj as { data: unknown }).data);
  };

  // Safely extract the decision list from the history query.
  // The useMemo hook with explicit checks provides clearer control flow for TypeScript,
  // avoiding compiler errors when `historyData` is inferred as `never` from a misconfigured RTK Query hook.
  const historyList: DecisionItem[] = React.useMemo(() => {
    const rawList = isDataWrapper(historyData)
      ? historyData.data
      : Array.isArray(historyData)
      ? historyData
      : [];

    // The raw list from the query hook might be of a generic `DecisionResponse[]` type.
    // We assert it to the component's more specific `DecisionItem[]` to ensure type compatibility
    // with the rest of the component, similar to how the `createDecision` response is handled.
    return rawList as DecisionItem[];
  }, [historyData]);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (problemStatement.trim().length < 10) {
      setFormError('Please describe your decision in a bit more detail (at least 10 characters).');
      return;
    }

    const filteredOptions = options.map((opt) => opt.trim()).filter((opt) => opt !== '');
    if (filteredOptions.length < 2) {
      setFormError('Please provide at least two valid options to compare.');
      return;
    }

    try {
      const response = await createDecision({
        problemStatement: problemStatement.trim(),
        options: filteredOptions,
        language,
      }).unwrap();

      // The type from `createDecision` might be too generic for `aiResult`.
      // We assert it to the component's `DecisionItem` type to resolve the mismatch
      // and align with the expected structure for the result view.
      setResult(response as DecisionItem);
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; message?: string };
      setFormError(apiError.data?.message || apiError.message || 'Failed to generate decision analysis.');
    }
  };

  const handleSelectHistoryItem = (item: DecisionItem) => {
    setResult(item);
    setIsHistoryOpen(false);
  };

  // Safely parse JSON payload if stringified
  const parsedAiResult: StructuredAIResult | null = React.useMemo(() => {
    if (!result?.aiResult) return null;
    if (typeof result.aiResult === 'object') return result.aiResult as StructuredAIResult;
    try {
      return JSON.parse(result.aiResult);
    } catch {
      return null;
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500/30 relative overflow-hidden transition-colors duration-300">
      {/* Background Accent Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* History Slide-over Drawer Overlay */}
      {isHistoryOpen && (
        <div 
          onClick={() => setIsHistoryOpen(false)} 
          className="fixed inset-0 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* History Slide-over Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col justify-between ${
          isHistoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
              <History className="text-indigo-500 dark:text-indigo-400" size={20} />
              <span>Decision History</span>
            </div>
            <button 
              onClick={() => setIsHistoryOpen(false)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* History List */}
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-500 gap-2">
              <Loader2 size={24} className="animate-spin text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs">Loading past analyses...</span>
            </div>
          ) : historyList.length === 0 ? ( //
            <div className="text-center py-12 text-slate-500 text-sm">
              No previous decision history found.
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((item, idx) => {
                let parsed: StructuredAIResult | null = null;
                if (typeof item.aiResult === 'object') {
                  parsed = item.aiResult as StructuredAIResult;
                } else {
                  try { parsed = JSON.parse(item.aiResult); } catch {}
                }

                return (
                  <div
                    key={item.id || item._id || idx}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="group p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all cursor-pointer relative"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      {parsed?.recommendation && (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold capitalize">
                          {parsed.recommendation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium line-clamp-2 pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {item.problemStatement}
                    </p>
                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-10">
        {/* Header Section */}
        <div className="relative text-center">
          {/* History Button (Top Right) */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="absolute right-0 top-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <History size={15} className="text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {historyList.length}
              </span>
            )}
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} className="animate-pulse" />
            AI Decision Architect
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
            Make <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Clarity-Driven</span> Decisions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Input your dilemma and options. Let AI weigh trade-offs and provide a balanced recommendation.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-2xl dark:shadow-indigo-950/20">
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {formError}
            </div>
          )}

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language Selector */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 size={14} /> Language Preference
                </label>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      language === 'en'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      language === 'bn'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>

              {/* Problem Statement Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What decision are you trying to make?
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="e.g., Should I switch to a remote job offer or stay at my current tech lead role?"
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm"
                />
              </div>

              {/* Options Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Options to compare</label>
                  <span className="text-xs text-slate-500">{options.length}/6 max</span>
                </div>

                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Plus size={14} /> Add another option
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Analyzing trade-offs...</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Generate Decision Analysis</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Result View */
            <div className="space-y-8 animate-fadeIn">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 size={18} /> Decision Analysis Ready
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setProblemStatement('');
                    setOptions(['', '']);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                >
                  <RotateCcw size={14} /> New Analysis
                </button>
              </div>

              {/* Problem Statement Display */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Problem Statement
                </h3>
                <p className="text-slate-800 dark:text-slate-200 text-lg font-medium">{result.problemStatement}</p>
              </div>

              {/* Structured AI Analysis Render */}
              {parsedAiResult ? (
                <div className="space-y-6">
                  {/* Recommendation Box */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/70 dark:to-purple-950/70 border border-indigo-500/20 dark:border-indigo-500/30 shadow-lg dark:shadow-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500 dark:text-indigo-400 pointer-events-none">
                      <Award size={96} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <Award size={16} /> Top Recommendation
                    </div>

                    <div className="text-2xl font-black capitalize text-indigo-900 dark:text-white tracking-wide">
                      {parsedAiResult.recommendation}
                    </div>

                    <div className="flex items-start gap-2 text-indigo-800 dark:text-slate-300 text-sm leading-relaxed pt-1">
                      <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{parsedAiResult.reasoning}</span>
                    </div>
                  </div>

                  {/* Options Comparison Cards */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Option Trade-Off Breakdown
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedAiResult.options.map((option, idx) => {
                        const isRecommended = 
                          option.name.toLowerCase() === parsedAiResult.recommendation.toLowerCase();

                        return (
                          <div
                            key={idx}
                            className={`rounded-xl p-5 border transition-all flex flex-col justify-between ${
                              isRecommended
                                ? 'bg-white dark:bg-slate-900/90 border-indigo-500/30 dark:border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                                : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                                  {option.name}
                                </h4>
                                {isRecommended && (
                                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-semibold tracking-wide uppercase">
                                    Recommended
                                  </span>
                                )}
                              </div>

                              <div className="mb-5 space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">Confidence Score</span>
                                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{option.confidenceScore}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isRecommended ? 'bg-indigo-500' : 'bg-slate-500'
                                    }`}
                                    style={{ width: `${Math.min(Math.max(option.confidenceScore, 0), 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <ThumbsUp size={12} /> Pros
                                </span>
                                <ul className="space-y-1.5">
                                  {option.pros.map((pro, pIdx) => (
                                    <li key={pIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                      <span className="text-emerald-500 dark:text-emerald-400 shrink-0">•</span>
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                  <ThumbsDown size={12} /> Cons
                                </span>
                                <ul className="space-y-1.5">
                                  {option.cons.map((con, cIdx) => (
                                    <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                      <span className="text-rose-500 dark:text-rose-400 shrink-0">•</span>
                                      <span>{con}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    AI Recommendation & Breakdown
                  </h3>
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {typeof result.aiResult === 'string'
                      ? result.aiResult
                      : JSON.stringify(result.aiResult, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionPage;