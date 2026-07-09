"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/developer/dashboard"); // We'll handle role-based redirection later
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-animated-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="w-full max-w-md p-8 glass-card rounded-2xl shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="System 42 Logo" className="h-16 w-auto drop-shadow-md" />
        </div>
        <h2 className="text-2xl font-extrabold text-center mb-6 text-violet-950 tracking-tight">Sign In to System 42</h2>
        {error && <p className="text-red-600 font-medium text-sm mb-4 text-center bg-red-100/50 p-2 rounded-md border border-red-200">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-300/50 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all sm:text-sm text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-300/50 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all sm:text-sm text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02] mt-4">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
