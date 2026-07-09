import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestResult from "@/domain/models/TestResult";
import Issue from "@/domain/models/Issue";
import RetestTask from "@/domain/models/RetestTask";
import TestRun from "@/domain/models/TestRun";
import { BarChart3, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Bug } from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // Basic aggregates
  const totalRuns = await TestRun.countDocuments();
  
  const passedCount = await TestResult.countDocuments({ result: "Pass" });
  const failedCount = await TestResult.countDocuments({ result: "Fail" });
  const blockedCount = await TestResult.countDocuments({ result: "Blocked" });
  const notTestedCount = await TestResult.countDocuments({ result: "Not Tested" });
  const totalResults = passedCount + failedCount + blockedCount + notTestedCount;

  const openIssues = await Issue.countDocuments({ status: "Open" });
  const inProgressIssues = await Issue.countDocuments({ status: "In Progress" });
  const fixedIssues = await Issue.countDocuments({ status: "Fixed" });
  const closedIssues = await Issue.countDocuments({ status: "Closed" });
  const reopenedIssues = await Issue.countDocuments({ status: "Reopened" });

  const retestPassed = await RetestTask.countDocuments({ status: "Passed" });
  const retestFailed = await RetestTask.countDocuments({ status: "Failed Again" });

  const passRate = totalResults > 0 ? Math.round((passedCount / totalResults) * 100) : 0;
  const failRate = totalResults > 0 ? Math.round((failedCount / totalResults) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Project Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Test Execution Summary</h2>
          </div>
          
          <div className="flex items-end gap-4 h-48 mb-6 border-b border-slate-100 pb-4">
            {/* Simple CSS bars for visualization */}
            <div className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="w-full bg-green-500 rounded-t-sm transition-all group-hover:bg-green-600" style={{ height: `${Math.max(passRate, 5)}%` }}></div>
              <div className="text-xs font-bold mt-2 text-slate-600">{passRate}%</div>
              <div className="text-xs text-slate-400">Pass</div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="w-full bg-red-500 rounded-t-sm transition-all group-hover:bg-red-600" style={{ height: `${Math.max(failRate, 5)}%` }}></div>
              <div className="text-xs font-bold mt-2 text-slate-600">{failRate}%</div>
              <div className="text-xs text-slate-400">Fail</div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="w-full bg-orange-400 rounded-t-sm transition-all group-hover:bg-orange-500" style={{ height: `${Math.max(totalResults > 0 ? (blockedCount/totalResults)*100 : 0, 5)}%` }}></div>
              <div className="text-xs font-bold mt-2 text-slate-600">{totalResults > 0 ? Math.round((blockedCount/totalResults)*100) : 0}%</div>
              <div className="text-xs text-slate-400">Blocked</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{passedCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Passed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <XCircle className="text-red-500" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{failedCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Failed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{blockedCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Blocked</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MinusCircle className="text-slate-400" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{notTestedCount}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Not Tested</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bug className="text-red-600" />
              <h2 className="text-lg font-bold text-slate-900">Issue Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Open</span>
                <span className="font-bold text-slate-900">{openIssues}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">In Progress</span>
                <span className="font-bold text-slate-900">{inProgressIssues}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Fixed (Pending Retest)</span>
                <span className="font-bold text-slate-900">{fixedIssues}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Reopened</span>
                <span className="font-bold text-red-600">{reopenedIssues}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                <span className="font-medium text-slate-900">Closed (Verified)</span>
                <span className="font-bold text-green-600">{closedIssues}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl p-6 text-white shadow-sm">
            <h2 className="text-lg font-bold mb-4 opacity-90">Retesting Quality</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="opacity-80 text-sm">Passed on First Retest</span>
              <span className="font-bold text-xl">{retestPassed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80 text-sm">Failed Again (Bounced)</span>
              <span className="font-bold text-xl text-red-200">{retestFailed}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-violet-400/30 text-xs opacity-70">
              High bounce rates indicate issues with developer fixes or unclear requirements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
