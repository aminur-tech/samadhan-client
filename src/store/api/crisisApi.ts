import { baseApi } from "./baseApi";

export type CrisisCategory = "medical" | "cybercrime" | "financial_fraud";

export interface CrisisReport {
  id: string;
  userId: string;
  category: CrisisCategory;
  description: string;
  language?: "en" | "bn";
  actionChecklist: string[] | string | null;
  resolved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCrisisReportInput {
  category: CrisisCategory;
  description: string;
  language?: "en" | "bn";
}

export interface ResolveCrisisInput {
  id: string;
  resolved: boolean;
}

export const crisisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCrisisReports: builder.query<CrisisReport[], void>({
      query: () => "/api/crisis",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Crisis" as const, id })),
              { type: "Crisis", id: "LIST" },
            ]
          : [{ type: "Crisis", id: "LIST" }],
    }),

    getCrisisById: builder.query<CrisisReport, string>({
      query: (id) => `/api/crisis/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Crisis", id }],
    }),

    createCrisisReport: builder.mutation<CrisisReport, CreateCrisisReportInput>({
      query: (body) => ({
        url: "/api/crisis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Crisis", id: "LIST" }],
    }),

    resolveCrisis: builder.mutation<CrisisReport, ResolveCrisisInput>({
      query: ({ id, resolved }) => ({
        url: `/api/crisis/${id}/resolve`,
        method: "PATCH",
        body: { resolved },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Crisis", id: "LIST" },
        { type: "Crisis", id },
      ],
    }),
  }),
});

export const {
  useGetCrisisReportsQuery,
  useGetCrisisByIdQuery,
  useCreateCrisisReportMutation,
  useResolveCrisisMutation,
} = crisisApi;