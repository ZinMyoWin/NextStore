"use client";

import { signIn } from "next-auth/react";
import useCart from "@/app/hooks/useCart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function SignIn() {
  const { session } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // Handle Credentials form submission
  const handleCredentialsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
      window.location.reload(); // Force refresh (optional)
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-3xl shadow-xl border border-border/50">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to NextStore
          </h1>
          <p className="text-muted-foreground text-base">
            Sign in to explore your account
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-100/50 py-2 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-300 disabled:bg-primary/60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In with Email"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-card px-3 py-1 text-muted-foreground font-medium rounded-full">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground font-semibold hover:bg-secondary/20 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-300 disabled:bg-background/60 disabled:cursor-not-allowed"
        >
          <Image
            src="/google.svg"
            alt="Google Logo"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          {loading ? "Processing..." : "Google Account"}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          Don’t have an account yet?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-primary hover:underline focus:outline-none transition-colors duration-200"
          >
            Sign Up
          </button>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}