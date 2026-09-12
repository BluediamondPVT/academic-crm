import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 animate-gradient-slow px-4 py-12 font-sans overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating glowing orbs for visual depth */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Centered Glassmorphic login box */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10 space-y-6">
        {/* Branding & Logo Header */}
        <div className="flex flex-col items-center space-y-2 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg shadow-lg shadow-indigo-500/30">
            A
          </div>
          <span className="text-xl font-bold tracking-widest text-slate-900">ACADEMIC CRM</span>
        
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-100">
          &copy; {new Date().getFullYear()} BDIT Academic CRM. All rights reserved.
        </div>
      </div>
    </div>
  );
}