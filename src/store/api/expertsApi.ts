import { baseApi } from "./baseApi";

export const expertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExperts: builder.query({
      query: () => "/api/experts",
      providesTags: ["Experts"],
    }),
    registerExpert: builder.mutation({
      query: (body: { specialty: string }) => ({
        url: "/api/experts/me",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Experts"],
    }),
    getConsultations: builder.query({
      query: () => "/api/consultations",
      providesTags: ["Consultations"],
    }),
    createConsultation: builder.mutation({
      query: (body: { expertId: string; scheduledAt: string; sessionType: string }) => ({
        url: "/api/consultations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Consultations"],
    }),
    updateConsultationStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: "CONFIRMED" | "COMPLETED" | "CANCELLED" }) => ({
        url: `/api/consultations/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Consultations"],
    }),
  }),
});

export const {
  useGetExpertsQuery,
  useRegisterExpertMutation,
  useGetConsultationsQuery,
  useCreateConsultationMutation,
  useUpdateConsultationStatusMutation,
} = expertsApi;