import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import { FolderGit2, Activity, Bug, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DeveloperDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  // Aggregate some simple metrics
  const projectCount = await Project.countDocuments({ createdBy: userId });
  const activeTestRuns = await TestRun.countDocuments({ assignedBy: userId, status: "In Progress" });
  const openIssues = await Issue.countDocuments({ status: { $in: ["Open", "In Progress", "Reopened"] } }); // Developer sees all issues for their projects ideally
  const completedRuns = await TestRun.countDocuments({ assignedBy: userId, status: "Completed" });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Developer Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {session?.user?.name}. Here's an overview of your testing operations.</p>
        </div>
        <Link href="/developer/projects/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Create Project
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Projects</h3>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <FolderGit2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{projectCount}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Test Runs</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeTestRuns}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Open Issues</h3>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <Bug size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{openIssues}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Runs</h3>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{completedRuns}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Test Runs</h2>
            <Link href="/developer/test-runs" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-slate-500 text-sm text-center">
              No recent test runs found.
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Issues</h2>
            <Link href="/developer/issues" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-slate-500 text-sm text-center">
              No issues reported yet.
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Activity Log</h2>
        </div>
        <div className="p-6 text-slate-500 text-sm text-center border-dashed border-2 border-slate-100 m-6 rounded-lg py-8">
          No recent activity found. Create a project to get started!
        </div>
      </div>
    </div>
  );
}
