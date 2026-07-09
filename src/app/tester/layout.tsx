import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  PlaySquare, 
  RotateCcw,
  LogOut
} from "lucide-react";

export default async function TesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "Tester") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 glass-sidebar text-slate-300 flex flex-col hidden md:flex shadow-xl shadow-violet-900/5">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="System 42 Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold text-white tracking-tight">System 42</h1>
          </div>
          <p className="text-xs mt-1 text-slate-400">Tester Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/tester/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-violet-900/50 hover:text-white transition-all duration-300 hover:translate-x-1">
            <PlaySquare size={20} className="text-violet-400" />
            <span>My Tasks</span>
          </Link>
          <Link href="/tester/retesting" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-violet-900/50 hover:text-white transition-all duration-300 hover:translate-x-1">
            <RotateCcw size={20} className="text-violet-400" />
            <span>Retesting</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {session.user?.name?.charAt(0) || "T"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors w-full">
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
