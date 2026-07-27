"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Eye, EyeOff, Loader2, User, Mail, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSyncUserProfileMutation } from "@/store/api/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [syncUserProfile] = useSyncUserProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up user via Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // 2. Sync profile metadata with Express Backend
      if (data.session) {
        await syncUserProfile({ name }).unwrap();
        router.push("/login");
      } else if (data.user && !data.session) {
        // Handle case where email confirmation is enabled on Supabase
        setError("Account created! Please check your email to confirm registration.");
      }
    } catch (err: unknown) {
      let message = "Registration failed. Please check your inputs.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-background overflow-hidden py-12">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Compass className="h-7 w-7 transition-transform duration-500 group-hover:rotate-45" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Samadhan
            </span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-xs text-muted-foreground">
              Get started with AI-driven decision tools & expert advice
            </p>
          </div>
        </div>

        {/* Register Glassmorphic Card */}
        <div className="p-8 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/30 space-y-6">
          {error && (
            <div className="p-3.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl animate-in fade-in-50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}