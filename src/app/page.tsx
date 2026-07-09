import Link from "next/link";
import { 
  CheckCircle2, 
  Bug, 
  Users, 
  PlayCircle, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck,
  BarChart3,
  FileText,
  Zap
} from "lucide-react";

const features = [
  {
    icon: <FileText size={22} className="text-indigo-600" />,
    title: "Create & Import Test Cases",
    desc: "Manually write test cases or upload CSV files. Group by module and project.",
  },
  {
    icon: <PlayCircle size={22} className="text-blue-600" />,
    title: "Assign Test Runs",
    desc: "Bundle test cases into runs and assign to specific testers with deadlines.",
  },
  {
    icon: <Bug size={22} className="text-red-600" />,
    title: "Automatic Bug Reports",
    desc: "When a tester marks a test case as Failed, an issue is automatically created — no manual steps.",
  },
  {
    icon: <RotateCcw size={22} className="text-yellow-600" />,
    title: "Smart Retesting Workflow",
    desc: "After a developer fixes a bug, retesting is automatically assigned back to the original tester.",
  },
  {
    icon: <CheckCircle2 size={22} className="text-green-600" />,
    title: "Issue Lifecycle Tracking",
    desc: "Track every issue from Open → In Progress → Fixed → Retest Required → Closed.",
  },
  {
    icon: <BarChart3 size={22} className="text-purple-600" />,
    title: "Reports & Analytics",
    desc: "See pass/fail/blocked rates, issue status breakdown, and retest success rates.",
  },
];

const workflow = [
  { step: "01", actor: "Developer", action: "Creates project, environments, and test cases." },
  { step: "02", actor: "Developer", action: "Assigns a test run with selected test cases to a tester." },
  { step: "03", actor: "Tester", action: "Executes test cases, uploads screenshots, and marks results." },
  { step: "04", actor: "System", action: "If a test case fails, an issue is automatically created." },
  { step: "05", actor: "Developer", action: "Reviews the bug, fixes it, and marks the issue as Fixed." },
  { step: "06", actor: "System", action: "A retest task is automatically sent to the original tester." },
  { step: "07", actor: "Tester", action: "Retests the fix. If Passed, issue closes. If Failed, it reopens." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">T</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">TestBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(79,70,229,0.2),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200 mb-8">
            <Zap size={14} className="text-indigo-400" />
            Built for development teams
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            The Testing Platform That
            <br />
            <span className="text-indigo-400">Closes Bugs Automatically</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            TestBridge connects your developers and testers with a complete workflow — from creating test cases to automatic bug tracking, retesting, and closing issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-lg shadow-indigo-900/40 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Start for Free <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/login">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold backdrop-blur-sm transition-all">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "100%", label: "Automated Bug Tracking" },
            { value: "2 Roles", label: "Developer & Tester" },
            { value: "Auto", label: "Retest Assignment" },
            { value: "CSV", label: "Bulk Test Case Import" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-extrabold text-indigo-600">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">Everything Your Team Needs</h2>
          <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
            A complete platform for managing the full software testing lifecycle — from test creation to issue resolution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-lg text-slate-500 mt-3">The complete testing lifecycle, automated end-to-end.</p>
          </div>
          <div className="space-y-4">
            {workflow.map((step, i) => (
              <div key={step.step} className="flex gap-5 items-start bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0 ${
                  step.actor === "System" ? "bg-indigo-600 text-white" :
                  step.actor === "Developer" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {step.step}
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 inline-block ${
                    step.actor === "System" ? "bg-indigo-100 text-indigo-700" :
                    step.actor === "Developer" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>{step.actor}</span>
                  <p className="text-sm font-medium text-slate-800">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900">Two Roles, One Platform</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-extrabold mb-3">Developer</h3>
            <ul className="space-y-2 text-sm text-indigo-100">
              {["Create projects & environments", "Upload or write test cases", "Assign test runs to testers", "Manage bug board (Kanban)", "Mark issues as fixed", "View reports & analytics"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl shadow-green-200">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-extrabold mb-3">Tester</h3>
            <ul className="space-y-2 text-sm text-green-100">
              {["View assigned test runs", "Execute test cases step-by-step", "Upload screenshots as proof", "Mark results (Pass/Fail/Blocked)", "Submit test results", "Complete retest tasks"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to streamline your testing?</h2>
        <p className="text-indigo-200 text-lg mb-8">Create your account in seconds. No credit card required.</p>
        <Link href="/register">
          <button className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-xl text-base font-bold shadow-lg transition-all hover:-translate-y-0.5">
            Create Your Account <ArrowRight size={18} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="font-semibold text-white">TestBridge</span>
        </div>
        <p className="text-slate-500">© {new Date().getFullYear()} TestBridge. Built for development teams.</p>
      </footer>
    </div>
  );
}
