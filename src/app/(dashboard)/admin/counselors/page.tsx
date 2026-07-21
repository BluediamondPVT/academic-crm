"use client";

import { useState, useEffect } from "react";
import { User, UserPlus, Mail, Lock, Loader2, CheckCircle2, AlertCircle, Users, Calendar, ShieldCheck } from "lucide-react";

interface Counselor {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function CreateCounselorPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);

  const fetchCounselors = async () => {
    setLoadingCounselors(true);
    try {
      const res = await fetch("/api/admin/counselors");
      if (res.ok) {
        const data = await res.json();
        setCounselors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching counselors:", err);
    } finally {
      setLoadingCounselors(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/counselors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create counselor");
      }

      setSuccess("Counselor created successfully!");
      setFormData({ name: "", email: "", password: "" });
      fetchCounselors();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Counselor Management Portal
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Create separate counselor accounts and view active counselors. Each counselor gets their own isolated workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Add Counselor Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-6">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Add New Counselor</h2>
              <p className="text-xs text-gray-400 font-medium">Grant independent login credentials</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-50 p-4 border border-green-200 flex items-center gap-3 text-green-700 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all"
                  placeholder="Abu Saalim"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all"
                  placeholder="saalim@bditacademic.com"
                />
              </div>
            </div> 

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#112a46] hover:bg-[#1a3d66] px-4 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-70 active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Counselor...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Create Counselor Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: List of Existing Counselors */}
        {/* <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Active Counselor Directory</h2>
                <p className="text-xs text-gray-400 font-medium">Isolated student data spaces assigned</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {counselors.length} Counselors
            </span>
          </div>

          {loadingCounselors ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="h-7 w-7 animate-spin text-indigo-600 mb-2" />
              <span className="text-xs font-medium">Loading active counselors...</span>
            </div>
          ) : counselors.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No counselors created yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Use the form on the left to create accounts. Each counselor will only see data assigned to or created by them.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {counselors.map((counselor) => (
                <div
                  key={counselor._id}
                  className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                      {counselor.name ? counselor.name.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {counselor.name}
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                          COUNSELOR
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {counselor.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-150 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Isolated Access
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {counselor.createdAt
                        ? new Date(counselor.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Active"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}