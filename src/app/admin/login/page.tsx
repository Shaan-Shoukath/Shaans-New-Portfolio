"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await signIn(data.email, data.password);
      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>

        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              P
            </div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 focus:border-indigo-500/50"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
