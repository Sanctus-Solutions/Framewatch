"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Force a fresh navigation so middleware re-checks the new cookie immediately.
      router.replace("/");
      router.refresh();
      window.location.assign("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050914] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            FrameWatch
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Login
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-cyan-400/30 bg-[#0f172a] px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none disabled:opacity-50"
              placeholder="Enter your username"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-cyan-400/30 bg-[#0f172a] px-4 py-2 text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none disabled:opacity-50"
              placeholder="Enter your password"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          FrameWatch MVP • Tuckertown Buildings
        </p>
      </div>
    </main>
  );
}
