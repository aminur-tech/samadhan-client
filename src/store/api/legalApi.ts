import { baseApi } from "./baseApi";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalCases: builder.query({
      query: () => "/api/legal-cases",
      providesTags: ["LegalCases"],
    }),
    getLegalCaseById: builder.query({
      query: (id: string) => `/api/legal-cases/${id}`,
      providesTags: (_result, _error, id) => [{ type: "LegalCases", id }],
    }),
    createLegalCase: builder.mutation({
      query: (body: { caseType: string; description: string }) => ({
        url: "/api/legal-cases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LegalCases"],
    }),
  }),
});

export const {
  useGetLegalCasesQuery,
  useGetLegalCaseByIdQuery,
  useCreateLegalCaseMutation,
} = legalApi;