import { baseApi } from "./baseApi";

export interface ResumeMatchResponse {
  success: boolean;
  data: {
    id: string;
    atsScore: number;
    companyName: string;
    jobTitle: string;
    recruiterEmail: string;
    matchedSkills: string[];
    missingSkills: string[];
    suggestions: string[];
    originalResumeText: string;
    originalFileUrl?: string;
    coverLetter?: string;
    applicationEmail?: string;
  };
}

export interface GeneratePdfResponse {
  success: boolean;
  data: {
    analysisId: string;
    pdfUrl: string;
    texUrl: string;
    latex: string;
    filename: string;
  };
}

export interface HistoryResponse {
  success: boolean;
  data: {
    history: Array<{
      id: string;
      companyName: string;
      jobTitle: string;
      atsScore: number;
      createdAt: string;
      optimizedResumePdfUrl?: string;
      coverLetter?: string;
      applicationEmail?: string;
    }>;
    stats: {
      totalAnalyzed: number;
      avgAtsScore: number;
      bestAtsScore: number;
    };
  };
}

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    matchResume: builder.mutation<ResumeMatchResponse, FormData>({
      query: (formData) => ({
        url: "/api/resume/match",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["History"],
    }),

    generateResumePdf: builder.mutation<
      GeneratePdfResponse,
      { analysisId: string }
    >({
      query: ({ analysisId }) => ({
        url: "/api/resume/generate-pdf",
        method: "POST",
        body: { analysisId },
      }),
      invalidatesTags: ["Resume", "History"],
    }),

    getResumeHistory: builder.query<HistoryResponse, void>({
      query: () => "/api/resume/history",
      providesTags: ["History"],
    }),

    getResumeHistoryById: builder.query<ResumeMatchResponse, string>({
      query: (id) => `/api/resume/history/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Resume", id }],
    }),
  }),
});

export const {
  useMatchResumeMutation,
  useGenerateResumePdfMutation,
  useGetResumeHistoryQuery,
  useGetResumeHistoryByIdQuery,
} = resumeApi;