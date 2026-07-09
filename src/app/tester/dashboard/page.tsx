import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import Link from "next/link";
import { PlayCircle, Clock, AlertCircle, FileCheck, CheckCircle } from "lucide-react";

export default async function TesterDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const assignedRuns = await TestRun.find({ 
    assignedTo: userId,
    status: { $in: ["Pending", "In Progress"] }
  })
    .populate('projectId', 'name')
    .populate('environmentId', 'name')
    .sort({ deadline: 1, createdAt: 1 });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tester Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {session?.user?.name}. Here's what's assigned to you.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <PlayCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{assignedRuns.length}</div>
            <div className="text-sm font-medium text-slate-500">Pending Tasks</div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{assignedRuns.filter(r => r.status === 'In Progress').length}</div>
            <div className="text-sm font-medium text-slate-500">In Progress</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <div className="text-sm font-medium text-slate-500">Completed</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <div className="text-sm font-medium text-slate-500">Retesting Tasks</div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-4">Assigned Test Runs</h2>

      {assignedRuns.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
            <FileCheck size={32} />
          </div>
          <h3 className="text-base font-medium text-slate-900">You're all caught up!</h3>
          <p className="mt-1 text-sm text-slate-500">No pending test runs assigned to you right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedRuns.map((run) => (
            <div key={run._id.toString()} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-bold text-slate-900 truncate pr-2">{run.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                    run.status === 'Pending' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {run.status}
                  </span>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Project</span>
                    <div className="text-sm text-slate-900">{run.projectId?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Environment</span>
                    <div className="text-sm text-slate-900">{run.environmentId?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 block mb-1">Test Cases</span>
                    <div className="text-sm text-slate-900">{run.testCaseIds.length} cases assigned</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                {run.deadline ? (
                  <div className="flex items-center text-xs font-medium text-slate-600">
                    <Clock size={14} className="mr-1 text-slate-400" />
                    Deadline: {new Date(run.deadline).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">No deadline set</div>
                )}
                
                <Link href={`/tester/test-runs/${run._id}`}>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                    {run.status === 'Pending' ? 'Start Testing' : 'Continue'}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
