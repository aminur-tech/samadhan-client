import { baseApi } from "./baseApi";

// Define User Profile Types matching your Supabase public schema / sync table
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface SyncUserRequest {
  name?: string;
  avatarUrl?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch user profile from your backend DB (synced with Supabase UUID)
    getMe: builder.query<AuthUser, void>({
      query: () => "/api/auth/me",
      providesTags: ["Auth"],
    }),

    // Sync or update profile details in your backend DB after client-side Supabase login
    syncUserProfile: builder.mutation<AuthUser, SyncUserRequest>({
      query: (userData) => ({
        url: "/api/auth/sync",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

// Hooks exported for backend profile operations
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useSyncUserProfileMutation,
} = authApi;