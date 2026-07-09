import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import RetestTask from "@/domain/models/RetestTask";
import Link from "next/link";
import { Bug, CheckCircle2, XCircle } from "lucide-react";

export default async function RetestingDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const tasks = await RetestTask.find({ assignedTo: userId })
    .populate('projectId', 'name')
    .populate('issueId', 'issueNumber title fixNote')
    .populate('testCaseId', 'testCaseId title')
    .sort({ createdAt: -1 });

  const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Passed" || t.status === "Failed Again");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Retesting Tasks</h1>

      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Retests</h2>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No pending retests</h3>
            <p className="mt-1 text-slate-500">You have checked all fixed issues!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingTasks.map((task) => (
              <Link href={`/tester/retesting/${task._id}`} key={task._id.toString()}>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-violet-500 hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold uppercase">
                      Action Required
                    </span>
                    <span className="text-xs font-bold text-slate-500">Issue #{task.issueId?.issueNumber}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{task.issueId?.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    <span className="font-semibold">Developer says:</span> "{task.issueId?.fixNote || 'No fix note provided.'}"
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 text-sm font-medium text-violet-600 flex items-center justify-end">
                    Verify Fix &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Completed Retests</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Issue</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Test Case</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Result</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedTasks.slice(0, 10).map(task => (
                <tr key={task._id.toString()} className="hover:bg-slate-50">
                  <td className="px-6 py-4">#{task.issueId?.issueNumber} - {task.issueId?.title}</td>
                  <td className="px-6 py-4">{task.testCaseId?.testCaseId}</td>
                  <td className="px-6 py-4">
                    {task.status === "Passed" ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle2 size={16} className="mr-1" /> Passed (Closed)
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-medium">
                        <XCircle size={16} className="mr-1" /> Failed Again (Reopened)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(task.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {completedTasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No completed retests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
