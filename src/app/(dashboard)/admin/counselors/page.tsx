"use client";

import { useState } from "react";
import { User, UserPlus, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateCounselorPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <UserPlus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          Add New Counselor
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
          Create a new counselor account to grant them access to the platform.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter Emai;"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Counselor...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
