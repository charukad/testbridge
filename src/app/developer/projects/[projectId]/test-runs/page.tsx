import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, PlayCircle, Clock, User, Server } from "lucide-react";

export default async function TestRunsPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // Populate assignedTo to get the tester's name
  const testRuns = await TestRun.find({ projectId: params.projectId })
    .populate('assignedTo', 'name email')
    .populate('environmentId', 'name')
    .sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Link href={`/developer/projects/${params.projectId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Test Runs</h1>
          <p className="text-sm text-slate-500 mt-1">Assign test cases to testers and track their progress.</p>
        </div>
        <Link href={`/developer/projects/${params.projectId}/test-runs/new`}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm">
            <PlusCircle size={16} />
            Create Test Run
          </Button>
        </Link>
      </div>

      {testRuns.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
            <PlayCircle size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No test runs assigned</h3>
          <p className="text-sm text-slate-500 mb-6">Group test cases into a test run and assign it to a tester.</p>
          <Link href={`/developer/projects/${params.projectId}/test-runs/new`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">Create Test Run</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {testRuns.map((run) => (
            <div key={run._id.toString()} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900 truncate pr-2">{run.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  run.status === 'Pending' ? 'bg-slate-100 text-slate-700' :
                  run.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  run.status === 'Submitted' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {run.status}
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Assigned To</p>
                    <p className="text-sm font-medium text-slate-900">{run.assignedTo?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{run.assignedTo?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                    <Server size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Environment</p>
                    <p className="text-sm font-medium text-slate-900">{run.environmentId?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center mt-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Test Cases</p>
                    <p className="text-lg font-bold text-slate-900">{run.testCaseIds.length}</p>
                  </div>
                  {run.deadline && (
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-end">
                        <Clock size={12} className="mr-1" /> Deadline
                      </p>
                      <p className="text-sm font-medium text-slate-900">{new Date(run.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-slate-500">Progress</p>
                  <p className="text-xs font-bold text-indigo-600">
                    {run.status === 'Completed' || run.status === 'Submitted' ? '100%' : run.status === 'In Progress' ? 'In Progress' : '0%'}
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${
                    run.status === 'Completed' || run.status === 'Submitted' ? 'bg-green-500 w-full' : 
                    run.status === 'In Progress' ? 'bg-indigo-500 w-1/2' : 'bg-slate-300 w-0'
                  }`}></div>
                </div>
                <Link href={`/developer/projects/${params.projectId}/test-runs/${run._id}`}>
                  <button className="w-full bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 py-1.5 rounded-md text-sm font-medium transition-colors">
                    View Results →
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
