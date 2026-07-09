import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import RetestTask from "@/domain/models/RetestTask";
import Link from "next/link";
import { Bug, CheckCircle2, XCircle, ArrowRight, Activity, AlertCircle } from "lucide-react";

export default async function RetestingDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const tasks = await RetestTask.find({ assignedTo: userId })
    .populate('projectId', 'name')
    .populate('issueId', 'issueNumber title fixNote severity')
    .populate('testCaseId', 'testCaseId title')
    .sort({ createdAt: -1 })
    .lean();

  const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Passed" || t.status === "Failed Again");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Retesting Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">Verify fixes submitted by developers and close out issues.</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-yellow-100 text-yellow-700 p-1.5 rounded-lg">
            <Activity size={18} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Pending Verification</h2>
        </div>
        
        {pendingTasks.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-4 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
            <p className="mt-1 text-slate-500 text-sm">There are no pending fixes to verify at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.map((task) => (
              <Link href={`/tester/retesting/${task._id}`} key={task._id.toString()}>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-yellow-200">
                      <AlertCircle size={12} /> Needs Retest
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shadow-inner border border-slate-200">
                      #{task.issueId?.issueNumber}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {task.issueId?.title}
                  </h3>
                  
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 flex-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Developer&apos;s Fix Note:</span> 
                    <p className="text-sm text-slate-700 line-clamp-3 italic">
                      &quot;{task.issueId?.fixNote || 'No fix note provided.'}&quot;
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 text-sm font-bold text-indigo-600 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Test Case: {task.testCaseId?.testCaseId}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Verify Fix <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <div className="bg-slate-100 text-slate-600 p-1.5 rounded-lg">
            <CheckCircle2 size={18} />
          </div>
          Completed Verifications
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Issue</th>
                  <th className="px-6 py-4 font-bold">Test Case</th>
                  <th className="px-6 py-4 font-bold">Result</th>
                  <th className="px-6 py-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedTasks.slice(0, 10).map(task => (
                  <tr key={task._id.toString()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <span className="font-bold text-slate-500 mr-2">#{task.issueId?.issueNumber}</span>
                      {task.issueId?.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold border border-slate-200 shadow-inner">
                        {task.testCaseId?.testCaseId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {task.status === "Passed" ? (
                        <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200 shadow-sm">
                          <CheckCircle2 size={14} className="mr-1.5" /> Passed (Closed)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 shadow-sm">
                          <XCircle size={14} className="mr-1.5" /> Failed (Reopened)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-right font-medium">{new Date(task.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {completedTasks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 size={24} className="mb-2 text-slate-300" />
                        <p>No completed retests yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
