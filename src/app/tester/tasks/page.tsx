import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import Link from "next/link";
import { Clock } from "lucide-react";

export default async function TesterTasks() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const allRuns = await TestRun.find({ 
    assignedTo: userId,
  })
    .populate('projectId', 'name')
    .populate('environmentId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">All test runs assigned to you.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Test Run</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                allRuns.map((run) => (
                  <tr key={run._id.toString()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{run.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{run.testCaseIds?.length || 0} test cases</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{run.projectId?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{run.environmentId?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-900">
                        {run.deadline ? (
                          <>
                            <Clock size={14} className="mr-1.5 text-slate-400" />
                            {new Date(run.deadline).toLocaleDateString()}
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        run.status === 'Pending' ? 'bg-slate-100 text-slate-800' :
                        run.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        run.status === 'Submitted' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {run.status === 'Completed' || run.status === 'Submitted' ? (
                        <Link href={`/tester/test-runs/${run._id}`}>
                          <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                            View Summary
                          </button>
                        </Link>
                      ) : (
                        <Link href={`/tester/test-runs/${run._id}`}>
                          <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm">
                            {run.status === 'Pending' ? 'Start' : 'Continue'}
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
