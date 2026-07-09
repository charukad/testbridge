import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-animated-gradient text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col space-y-8 bg-white/10 p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center gap-6">
          <img src="/logo.png" alt="System 42 Logo" className="h-24 w-auto mb-4 drop-shadow-2xl" />
          <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            System 42
          </h1>
        </div>
        <p className="text-xl text-slate-200 text-center max-w-2xl font-light leading-relaxed">
          The ultimate platform for software testing management. Seamlessly connect developers and testers, track test cases, and automatically manage bugs.
        </p>
        <div className="flex gap-4 pt-8">
          <Link href="/login">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-violet-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105 rounded-full px-8 font-semibold">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all rounded-full px-8">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
