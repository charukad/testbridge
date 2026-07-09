import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600 tracking-tight">TestBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Connect developers and testers in one <span className="text-indigo-600">simple testing workflow.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Create test cases, assign testing tasks, collect tester notes and screenshots, automatically create bugs, and manage retesting until every issue is closed.
              </p>
              <div className="flex space-x-4">
                <Link href="/register">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-md shadow-md">
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md px-8">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-6">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="h-6 w-32 bg-slate-100 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                  </div>
                </div>
                {/* Mockup Content Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Test Run Progress</div>
                    <div className="h-2 w-full bg-slate-200 rounded-full mb-2">
                      <div className="h-full bg-indigo-500 rounded-full w-[70%]"></div>
                    </div>
                    <div className="text-xs text-slate-400">70% Completed</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Status</div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">25 Pass</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">5 Fail</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Mockup Issues list */}
                <div className="space-y-3">
                  <div className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-white shadow-sm">
                    <div>
                      <div className="text-sm font-medium text-slate-800">Issue #12</div>
                      <div className="text-xs text-slate-500">Checkout button not working</div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">Open</span>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-lg flex justify-between items-center bg-white shadow-sm">
                    <div>
                      <div className="text-sm font-medium text-slate-800">Retesting Task</div>
                      <div className="text-xs text-slate-500">Login validation error</div>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">Retest Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need for seamless testing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">For Developers</h3>
              <p className="text-slate-600 text-sm">Create test cases, build test runs, assign them to testers, and track progress effortlessly in real-time.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">For Testers</h3>
              <p className="text-slate-600 text-sm">Receive clear testing tasks, submit results, write notes, and upload screenshots seamlessly.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Automatic Bug Workflow</h3>
              <p className="text-slate-600 text-sm">When a test fails, TestBridge automatically creates a bug, and triggers a retesting task once fixed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to streamline your software testing?</h2>
          <p className="text-indigo-100 mb-8 text-lg">Join TestBridge today and bring developers and testers together.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-6 rounded-md shadow-lg text-lg font-semibold">
              Create an Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
