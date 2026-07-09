import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ListTodo, 
  RotateCcw,
  CheckCircle,
  UserCircle,
  LogOut,
  Bell
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
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex h-full">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">TestBridge</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/tester/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/tester/tasks" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
            <ListTodo size={18} />
            <span>My Tasks</span>
          </Link>
          <Link href="/tester/retesting" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
            <RotateCcw size={18} />
            <span>Retesting</span>
          </Link>
          <Link href="/tester/completed" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
            <CheckCircle size={18} />
            <span>Completed</span>
          </Link>
          <Link href="/tester/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-medium transition-colors">
            <UserCircle size={18} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-end px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-slate-900">{session.user?.name}</span>
                <span className="text-xs text-slate-500">Tester</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {session.user?.name?.charAt(0) || "T"}
              </div>
            </div>
            <Link href="/api/auth/signout" className="text-slate-400 hover:text-red-500 transition-colors ml-2">
              <LogOut size={20} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
