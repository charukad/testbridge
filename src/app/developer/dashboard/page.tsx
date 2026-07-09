import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import ActivityLog from "@/domain/models/ActivityLog";
import { FolderGit2, Activity, Bug, CheckCircle, PlusCircle, Clock } from "lucide-react";
import Link from "next/link";

const statusBadgeClass: Record<string, string> = {
  "Open": "bg-red-100 text-red-700",
  "Reopened": "bg-red-100 text-red-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Retest Required": "bg-yellow-100 text-yellow-700",
  "Retesting": "bg-yellow-100 text-yellow-700",
  "Fixed": "bg-purple-100 text-purple-700",
  "Closed": "bg-green-100 text-green-700",
  "Rejected": "bg-slate-100 text-slate-600",
  "Pending": "bg-slate-100 text-slate-600",
  "Completed": "bg-green-100 text-green-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default async function DeveloperDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  let projectCount = 0;
  let activeTestRuns = 0;
  let openIssues = 0;
  let completedRuns = 0;
  let recentRuns: any[] = [];
  let recentIssues: any[] = [];
  let recentActivity: any[] = [];

  try {
    [projectCount, activeTestRuns, openIssues, completedRuns, recentRuns, recentIssues, recentActivity] = await Promise.all([
      Project.countDocuments({ createdBy: userId }),
      TestRun.countDocuments({ assignedBy: userId, status: { $in: ["Pending", "In Progress"] } }),
      Issue.countDocuments({ status: { $in: ["Open", "In Progress", "Reopened"] } }),
      TestRun.countDocuments({ assignedBy: userId, status: "Completed" }),
      TestRun.find({ assignedBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("projectId", "name")
        .populate("assignedTo", "name")
        .lean(),
      Issue.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("projectId", "name")
        .populate("reportedBy", "name")
        .lean(),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("userId", "name")
        .lean(),
    ]);
  } catch (err) {
    console.error("Developer dashboard DB error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Developer Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{session?.user?.name}</span>. Here&apos;s your testing overview.
          </p>
        </div>
        <Link href="/developer/projects/new">
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <PlusCircle size={16} /> Create Project
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Projects</h3>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <FolderGit2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{projectCount}</div>
          <Link href="/developer/projects" className="text-xs font-medium text-indigo-600 hover:underline mt-2 inline-block">View all →</Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Test Runs</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeTestRuns}</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Open Issues</h3>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <Bug size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{openIssues}</div>
          <Link href="/developer/issues" className="text-xs font-medium text-red-600 hover:underline mt-2 inline-block">View board →</Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Runs</h3>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{completedRuns}</div>
        </div>
      </div>

      {/* Recent Test Runs & Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Test Runs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            <h2 className="text-base font-semibold text-slate-900">Recent Test Runs</h2>
          </div>
          {recentRuns.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No test runs yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentRuns.map((run: any) => (
                <li key={run._id.toString()} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{run.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {run.projectId?.name || "Unknown"} · {run.assignedTo?.name || "Unknown"}
                    </p>
                  </div>
                  <StatusBadge status={run.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug size={16} className="text-red-500" />
              <h2 className="text-base font-semibold text-slate-900">Recent Issues</h2>
            </div>
            <Link href="/developer/issues" className="text-xs font-medium text-indigo-600 hover:underline">View Board →</Link>
          </div>
          {recentIssues.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No issues reported yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentIssues.map((issue: any) => (
                <Link href={`/developer/issues/${issue._id}`} key={issue._id.toString()}>
                  <li className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-400">#{issue.issueNumber}</span>
                        <p className="font-semibold text-slate-900 text-sm truncate">{issue.title}</p>
                      </div>
                      <p className="text-xs text-slate-500">{issue.projectId?.name || "Unknown"} · {issue.reportedBy?.name || "Unknown"}</p>
                    </div>
                    <StatusBadge status={issue.status} />
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No recent activity. Create a project to get started!</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((log: any) => (
              <li key={log._id.toString()} className="px-6 py-3 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {log.userId?.name?.charAt(0) || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">{log.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
