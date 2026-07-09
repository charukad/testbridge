import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import ActivityLog from "@/domain/models/ActivityLog";
import { FolderGit2, Activity, Bug, CheckCircle, PlusCircle, Clock, AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
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
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default async function DeveloperDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  const [projectCount, activeTestRuns, openIssues, completedRuns, recentRuns, recentIssues, recentActivity] = await Promise.all([
    Project.countDocuments({ createdBy: userId }),
    TestRun.countDocuments({ assignedBy: userId, status: { $in: ["Pending", "In Progress"] } }),
    Issue.countDocuments({ status: { $in: ["Open", "In Progress", "Reopened"] } }),
    TestRun.countDocuments({ assignedBy: userId, status: "Completed" }),
    TestRun.find({ assignedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("projectId", "name")
      .populate("assignedTo", "name"),
    Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("projectId", "name")
      .populate("reportedBy", "name"),
    ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("userId", "name"),
  ]);

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
        {[
          { label: "Total Projects", value: projectCount, icon: <FolderGit2 size={20} />, color: "indigo", href: "/developer/projects" },
          { label: "Active Test Runs", value: activeTestRuns, icon: <Activity size={20} />, color: "blue", href: null },
          { label: "Open Issues", value: openIssues, icon: <Bug size={20} />, color: "red", href: "/developer/issues" },
          { label: "Completed Runs", value: completedRuns, icon: <CheckCircle size={20} />, color: "green", href: null },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.label}</h3>
              <div className={`w-10 h-10 bg-${card.color}-50 text-${card.color}-600 rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
            {card.href && (
              <Link href={card.href} className={`text-xs font-medium text-${card.color}-600 hover:underline mt-2 inline-block`}>
                View all →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Test Runs & Recent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Test Runs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2"><Activity size={16} className="text-blue-500" /> Recent Test Runs</h2>
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
                      {run.projectId?.name} · Assigned to {run.assignedTo?.name || "Unknown"}
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
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2"><Bug size={16} className="text-red-500" /> Recent Issues</h2>
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
                      <p className="text-xs text-slate-500">{issue.projectId?.name} · by {issue.reportedBy?.name}</p>
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
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" /> Recent Activity
          </h2>
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
