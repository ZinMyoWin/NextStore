"use client";

import { signIn } from "next-auth/react"; // Added for Google sign-up
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred");
      console.error("Signup error:", err);
    }
  };

  // Handle Google sign-up (triggers sign-in, auto-registers via callback)
  const handleGoogleSignUp = async () => {
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
            Join NextStore
          </h1>
          <p className="text-muted-foreground text-base">
            Create an account to get started
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-card px-3 py-1 text-muted-foreground font-medium rounded-full">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google Sign-Up */}
        <button
          onClick={handleGoogleSignUp}
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

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          Have an account?{" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-primary hover:underline focus:outline-none transition-colors duration-200"
          >
            Sign In
          </button>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground font-medium">
          By signing up, you agree to our{" "}
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