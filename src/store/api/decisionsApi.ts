import { baseApi } from "./baseApi";

export interface DecisionResponse {
  id: string;
  userId: string;
  problemStatement: string;
  options: string[];
  aiResult: string | Record<string, unknown>;
  status: string;
  createdAt: string;
}

export interface CreateDecisionInput {
  problemStatement: string;
  options: string[];
  language?: "en" | "bn";
}

export const decisionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDecisions: builder.query<DecisionResponse[], void>({
      query: () => "/api/decisions",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Decisions" as const, id })),
              { type: "Decisions", id: "LIST" },
            ]
          : [{ type: "Decisions", id: "LIST" }],
    }),
    getDecisionById: builder.query<DecisionResponse, string>({
      query: (id) => `/api/decisions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Decisions", id }],
    }),
    createDecision: builder.mutation<DecisionResponse, CreateDecisionInput>({
      query: (body) => ({
        url: "/api/decisions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Decisions", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDecisionsQuery,
  useGetDecisionByIdQuery,
  useCreateDecisionMutation,
} = decisionsApi;