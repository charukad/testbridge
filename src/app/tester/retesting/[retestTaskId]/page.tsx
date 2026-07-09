import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import RetestTask from "@/domain/models/RetestTask";
import Issue from "@/domain/models/Issue";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { ArrowLeft, Bug } from "lucide-react";
import RetestForm from "./RetestForm";

export default async function RetestTaskDetailPage({ params }: { params: { retestTaskId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const task = await RetestTask.findOne({ 
    _id: params.retestTaskId,
    assignedTo: userId
  }).populate('projectId', 'name');

  if (!task) return <div>Task not found or unauthorized.</div>;

  const issue = await Issue.findById(task.issueId);
  const testCase = await TestCase.findById(task.testCaseId);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/tester/retesting" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Retesting
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold uppercase">
                Retest Task
              </span>
              <span className="text-xs font-bold text-slate-500">Issue #{issue?.issueNumber}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Verify Fix: {issue?.title}</h1>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Developer Fix Note</h3>
                <div className="p-4 bg-violet-50 rounded-lg text-sm text-violet-900 whitespace-pre-wrap border border-violet-100 font-medium">
                  {issue?.fixNote || "No fix note provided. Please verify the issue is resolved."}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Original Bug Description</h3>
                <div className="p-4 bg-red-50 rounded-lg text-sm text-red-900 whitespace-pre-wrap border border-red-100">
                  <span className="font-semibold block mb-1">Tester Note:</span>
                  {issue?.description}
                  
                  <span className="font-semibold block mt-4 mb-1">Actual Result:</span>
                  {issue?.actualResult}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Expected Result</h3>
                <div className="p-4 bg-emerald-50 rounded-lg text-sm text-emerald-900 whitespace-pre-wrap border border-emerald-100">
                  {issue?.expectedResult}
                </div>
              </div>
              
              {testCase && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Original Test Steps ({testCase.testCaseId})</h3>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap border border-slate-200 font-mono">
                    {testCase.steps}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <RetestForm retestTaskId={params.retestTaskId} />
        </div>
      </div>
    </div>
  );
}
