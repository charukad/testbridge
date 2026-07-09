import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestResult from "@/domain/models/TestResult";
import RetestTask from "@/domain/models/RetestTask";
import Link from "next/link";
import { PlayCircle, Clock, AlertCircle, FileCheck, CheckCircle, RotateCcw } from "lucide-react";

export default async function TesterDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  const [assignedRuns, completedRuns, retestTasks] = await Promise.all([
    TestRun.find({ assignedTo: userId, status: { $in: ["Pending", "In Progress"] } })
      .populate("projectId", "name")
      .populate("environmentId", "name")
      .sort({ deadline: 1, createdAt: 1 }),
    TestRun.countDocuments({ assignedTo: userId, status: "Completed" }),
    RetestTask.find({ assignedTo: userId, status: { $in: ["Pending", "In Progress"] } })
      .populate("issueId", "issueNumber title")
      .populate("projectId", "name")
      .sort({ createdAt: -1 }),
  ]);

  const inProgressCount = (assignedRuns as any[]).filter((r) => r.status === "In Progress").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tester Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, <span className="font-semibold text-slate-700">{session?.user?.name}</span>. Here&apos;s what&apos;s assigned to you.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Tasks", value: assignedRuns.length, icon: <PlayCircle size={22} />, color: "indigo" },
          { label: "In Progress", value: inProgressCount, icon: <Clock size={22} />, color: "blue" },
          { label: "Completed Runs", value: completedRuns, icon: <CheckCircle size={22} />, color: "green" },
          { label: "Retest Tasks", value: retestTasks.length, icon: <RotateCcw size={22} />, color: "yellow" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-${card.color}-50 rounded-full flex items-center justify-center text-${card.color}-600 shrink-0`}>
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <div className="text-sm font-medium text-slate-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Retest Tasks Alert */}
      {retestTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <RotateCcw size={18} className="text-yellow-500" /> Pending Retest Tasks
            </h2>
            <Link href="/tester/retesting" className="text-sm font-medium text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(retestTasks as any[]).slice(0, 3).map((task) => (
              <Link href={`/tester/retesting/${task._id}`} key={task._id.toString()}>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                      Issue #{task.issueId?.issueNumber}
                    </span>
                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">Retest</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {task.issueId?.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{task.projectId?.name}</p>
                  <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-md py-1.5 text-sm font-medium transition-colors">
                    Start Retest →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Test Runs */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <PlayCircle size={18} className="text-indigo-500" /> Assigned Test Runs
        </h2>
        {assignedRuns.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FileCheck size={32} />
            </div>
            <h3 className="text-base font-medium text-slate-900">You&apos;re all caught up!</h3>
            <p className="mt-1 text-sm text-slate-500">No pending test runs assigned to you right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(assignedRuns as any[]).map((run) => (
              <div key={run._id.toString()} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold text-slate-900 truncate pr-2">{run.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${run.status === "Pending" ? "bg-slate-100 text-slate-700" : "bg-blue-100 text-blue-700"}`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2 text-slate-500"><span className="font-medium text-slate-700">Project:</span> {run.projectId?.name || "Unknown"}</div>
                    <div className="flex gap-2 text-slate-500"><span className="font-medium text-slate-700">Environment:</span> {run.environmentId?.name || "Unknown"}</div>
                    <div className="flex gap-2 text-slate-500"><span className="font-medium text-slate-700">Cases:</span> {run.testCaseIds?.length || 0} assigned</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                  {run.deadline ? (
                    <div className="flex items-center text-xs font-medium text-slate-600">
                      <Clock size={14} className="mr-1 text-slate-400" />
                      Due: {new Date(run.deadline).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">No deadline set</div>
                  )}
                  <Link href={`/tester/test-runs/${run._id}`}>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                      {run.status === "Pending" ? "Start Testing" : "Continue"}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
