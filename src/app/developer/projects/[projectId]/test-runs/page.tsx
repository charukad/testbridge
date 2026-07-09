import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, PlayCircle, Clock } from "lucide-react";

export default async function TestRunsPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // Populate assignedTo to get the tester's name
  const testRuns = await TestRun.find({ projectId: params.projectId })
    .populate('assignedTo', 'name email')
    .populate('environmentId', 'name')
    .sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={`/developer/projects/${params.projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" />
            Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Test Runs</h1>
        </div>
        <Link href={`/developer/projects/${params.projectId}/test-runs/new`}>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <PlusCircle size={16} />
            Assign Test Run
          </Button>
        </Link>
      </div>

      {testRuns.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <PlayCircle size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No test runs assigned</h3>
          <p className="mt-1 text-slate-500">Assign test cases to a tester to start a test run.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testRuns.map((run) => (
            <div key={run._id.toString()} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-900">{run.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  run.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  run.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {run.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900 mr-2">Tester:</span>
                  {run.assignedTo?.name || 'Unknown'} ({run.assignedTo?.email || 'N/A'})
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900 mr-2">Environment:</span>
                  {run.environmentId?.name || 'Unknown'}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-slate-900 mr-2">Test Cases:</span>
                  {run.testCaseIds.length}
                </div>
                {run.deadline && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock size={16} className="text-slate-400 mr-2" />
                    <span className="font-medium text-slate-900 mr-2">Deadline:</span>
                    {new Date(run.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Created on {new Date(run.createdAt).toLocaleDateString()}</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: run.status === 'Completed' ? '100%' : run.status === 'In Progress' ? '45%' : '0%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
