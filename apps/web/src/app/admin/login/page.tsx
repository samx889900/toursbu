"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.mustChangePassword) {
        toast.info("Please change your temporary password.");
        // ponytail: force-change-password page can be added later;
        // for now redirect to admin settings
        router.push("/admin/settings");
      } else {
        router.push("/admin");
      }
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Tours<span className="text-[hsl(var(--primary))]">BU</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-white shadow-lg shadow-black/[0.04] p-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-[hsl(var(--primary))]" />
            <h1 className="text-xl font-bold text-[var(--tbu-ink)]">
              Admin Portal
            </h1>
          </div>
          <p className="text-sm text-[var(--tbu-muted)] mb-6">
            Sign in with your administrator credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[var(--tbu-ink)] mb-1.5"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--tbu-hairline)] bg-[var(--tbu-parchment)] px-4 py-3 text-sm text-[var(--tbu-ink)] placeholder:text-[var(--tbu-muted)] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[var(--tbu-ink)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--tbu-hairline)] bg-[var(--tbu-parchment)] px-4 py-3 pr-11 text-sm text-[var(--tbu-ink)] placeholder:text-[var(--tbu-muted)] outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold py-3 px-4 text-sm hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--tbu-muted)]">
          This portal is for authorized administrators only.
        </p>
      </div>
    </div>
  );
}
