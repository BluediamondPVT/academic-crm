"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, Info } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect based on role received from DB
        const userRole = data.data.role;
        if (userRole === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/counselor");
        }
        router.refresh();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (email: string) => {
    setFormData({ email, password: "password123" });
    setError("");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500">
          Please enter your details to sign in to your account.
        </p>
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <Info size={14} className="text-indigo-600 animate-pulse" />
          <span>DEMO CREDENTIALS (CLICK TO AUTO-FILL)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleFillCredentials("admin@bditacademic.com")}
            className="flex flex-col items-start p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/40 active:bg-indigo-50 transition-all cursor-pointer text-left group"
          >
            <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Admin</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 select-all">admin@bditacademic.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleFillCredentials("counselor@bditacademic.com")}
            className="flex flex-col items-start p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/40 active:bg-indigo-50 transition-all cursor-pointer text-left group"
          >
            <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Counselor</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 select-all">counselor@bditacademic.com</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <span className="font-semibold">Error:</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 block" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

       

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2" size={18} />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
