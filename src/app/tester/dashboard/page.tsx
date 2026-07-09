import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import Link from "next/link";
import { PlayCircle, Clock } from "lucide-react";

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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Testing Tasks</h1>

      {assignedRuns.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <PlayCircle size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">You're all caught up!</h3>
          <p className="mt-1 text-slate-500">No pending test runs assigned to you right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedRuns.map((run) => (
            <Link href={`/tester/test-runs/${run._id}`} key={run._id.toString()}>
              <div className="glass-card p-6 rounded-2xl shadow-lg shadow-slate-200/40 hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col relative overflow-hidden group border border-slate-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-900 transition-colors">{run.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    run.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {run.status}
                  </span>
                </div>
                
                <div className="space-y-4 flex-1 mb-6 mt-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-violet-400 mr-3"></div>
                    <span className="font-semibold text-slate-800 mr-2">Project:</span>
                    {run.projectId?.name || 'Unknown'}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mr-3"></div>
                    <span className="font-semibold text-slate-800 mr-2">Environment:</span>
                    {run.environmentId?.name || 'Unknown'}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                    <span className="font-semibold text-slate-800 mr-2">Cases to Run:</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">{run.testCaseIds.length}</span>
                  </div>
                  {run.deadline && (
                    <div className="flex items-center text-sm text-rose-600 mt-4 bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <Clock size={16} className="mr-2" />
                      <span className="font-bold mr-2">Deadline:</span>
                      {new Date(run.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200/60 text-sm font-bold text-violet-600 flex items-center justify-end group-hover:text-indigo-600 transition-colors">
                  Open Test Run <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
