import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import TestRun from "@/domain/models/TestRun";
import TestResult from "@/domain/models/TestResult";
import Issue from "@/domain/models/Issue";
import RetestTask from "@/domain/models/RetestTask";
import { BarChart3, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Bug, RotateCcw, Clock } from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  const [
    allTestRuns,
    allResults,
    allIssues,
    allRetestTasks,
    projectCount,
  ] = await Promise.all([
    TestRun.find({ assignedBy: userId }).populate("projectId", "name").populate("assignedTo", "name").sort({ createdAt: -1 }),
    TestResult.find(),
    Issue.find().sort({ createdAt: -1 }),
    RetestTask.find(),
    Project.countDocuments({ createdBy: userId }),
  ]);

  // Result breakdown
  const passCount = (allResults as any[]).filter((r) => r.result === "Pass").length;
  const failCount = (allResults as any[]).filter((r) => r.result === "Fail").length;
  const blockedCount = (allResults as any[]).filter((r) => r.result === "Blocked").length;
  const notTestedCount = (allResults as any[]).filter((r) => r.result === "Not Tested").length;
  const totalResults = allResults.length;

  // Issue breakdown
  const openIssues = (allIssues as any[]).filter((i) => i.status === "Open").length;
  const inProgressIssues = (allIssues as any[]).filter((i) => i.status === "In Progress").length;
  const retestRequiredIssues = (allIssues as any[]).filter((i) => i.status === "Retest Required").length;
  const closedIssues = (allIssues as any[]).filter((i) => i.status === "Closed").length;
  const reopenedIssues = (allIssues as any[]).filter((i) => i.status === "Reopened").length;
  const rejectedIssues = (allIssues as any[]).filter((i) => i.status === "Rejected").length;

  // Retest breakdown
  const retestPassedCount = (allRetestTasks as any[]).filter((r) => r.status === "Passed").length;
  const retestFailedCount = (allRetestTasks as any[]).filter((r) => r.status === "Failed Again").length;

  // Test run status breakdown
  const completedRuns = (allTestRuns as any[]).filter((r) => r.status === "Completed").length;
  const activeRuns = (allTestRuns as any[]).filter((r) => r.status === "In Progress" || r.status === "Pending").length;

  const resultPercent = (n: number) => totalResults === 0 ? 0 : Math.round((n / totalResults) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of all testing activities across your projects.</p>
      </div>

      {/* Top level stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Total Projects", value: projectCount, color: "indigo", icon: <BarChart3 size={20} /> },
          { label: "Total Test Runs", value: allTestRuns.length, color: "blue", icon: <Clock size={20} /> },
          { label: "Total Issues", value: allIssues.length, color: "red", icon: <Bug size={20} /> },
          { label: "Retest Tasks", value: allRetestTasks.length, color: "yellow", icon: <RotateCcw size={20} /> },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 bg-${s.color}-50 text-${s.color}-600 rounded-lg flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Result Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-base font-semibold text-slate-900">Test Result Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">{totalResults} total results submitted</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Passed", value: passCount, color: "green", icon: <CheckCircle2 size={16} className="text-green-600" /> },
              { label: "Failed", value: failCount, color: "red", icon: <XCircle size={16} className="text-red-600" /> },
              { label: "Blocked", value: blockedCount, color: "orange", icon: <AlertTriangle size={16} className="text-orange-500" /> },
              { label: "Not Tested", value: notTestedCount, color: "slate", icon: <MinusCircle size={16} className="text-slate-400" /> },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {r.icon}
                    <span className="text-sm font-medium text-slate-700">{r.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{r.value} <span className="font-normal text-slate-400">({resultPercent(r.value)}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${r.color}-500 transition-all duration-700`}
                    style={{ width: `${resultPercent(r.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-base font-semibold text-slate-900">Issue Status Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">{allIssues.length} total issues</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Open", value: openIssues, cls: "bg-red-50 border-red-100 text-red-700" },
                { label: "In Progress", value: inProgressIssues, cls: "bg-blue-50 border-blue-100 text-blue-700" },
                { label: "Retest Required", value: retestRequiredIssues, cls: "bg-yellow-50 border-yellow-100 text-yellow-700" },
                { label: "Closed", value: closedIssues, cls: "bg-green-50 border-green-100 text-green-700" },
                { label: "Reopened", value: reopenedIssues, cls: "bg-red-50 border-red-100 text-red-700" },
                { label: "Rejected", value: rejectedIssues, cls: "bg-slate-50 border-slate-200 text-slate-600" },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg border p-4 ${s.cls}`}>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs font-semibold mt-0.5 opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Retest Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">Retest Summary</h2>
          <p className="text-xs text-slate-500 mt-0.5">{allRetestTasks.length} retests performed</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
            <div className="text-4xl font-extrabold text-green-700">{retestPassedCount}</div>
            <div className="text-sm font-semibold text-green-600 mt-1">Retest Passed</div>
            <div className="text-xs text-green-500 mt-0.5">Issues successfully closed</div>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
            <div className="text-4xl font-extrabold text-red-700">{retestFailedCount}</div>
            <div className="text-sm font-semibold text-red-600 mt-1">Retest Failed Again</div>
            <div className="text-xs text-red-500 mt-0.5">Issues sent back to developer</div>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="text-4xl font-extrabold text-indigo-700">
              {allRetestTasks.length === 0 ? "—" : `${Math.round((retestPassedCount / allRetestTasks.length) * 100)}%`}
            </div>
            <div className="text-sm font-semibold text-indigo-600 mt-1">First-Time Fix Rate</div>
            <div className="text-xs text-indigo-500 mt-0.5">Percentage of retests that passed</div>
          </div>
        </div>
      </div>

      {/* Recent Test Runs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">All Test Runs</h2>
        </div>
        {allTestRuns.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No test runs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left font-bold">Run Name</th>
                  <th className="px-5 py-3 text-left font-bold">Project</th>
                  <th className="px-5 py-3 text-left font-bold">Assigned To</th>
                  <th className="px-5 py-3 text-left font-bold">Cases</th>
                  <th className="px-5 py-3 text-left font-bold">Status</th>
                  <th className="px-5 py-3 text-left font-bold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(allTestRuns as any[]).map((run) => (
                  <tr key={run._id.toString()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">{run.name}</td>
                    <td className="px-5 py-3 text-slate-600">{run.projectId?.name || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{run.assignedTo?.name || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{run.testCaseIds?.length || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        run.status === "Completed" ? "bg-green-100 text-green-700" :
                        run.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{run.status}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{new Date(run.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
