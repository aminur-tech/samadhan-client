import { supabase } from "@/lib/supabase";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
    prepareHeaders: async (headers) => {
      // Retrieve the current user's session token from Supabase
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Decisions", "LegalCases", "Crisis", "Experts", "Consultations", "Resume", "History"],
  endpoints: () => ({}),
});