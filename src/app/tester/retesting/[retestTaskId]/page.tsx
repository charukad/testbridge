import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import RetestTask from "@/domain/models/RetestTask";
import Issue from "@/domain/models/Issue";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { ArrowLeft, Bug, AlertCircle, FileText } from "lucide-react";
import RetestForm from "./RetestForm";

export default async function RetestTaskDetailPage({ params }: { params: { retestTaskId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const task = await RetestTask.findOne({ 
    _id: params.retestTaskId,
    assignedTo: userId
  }).populate('projectId', 'name');

  if (!task) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="text-red-500 w-12 h-12 mb-4 opacity-50" />
      <h2 className="text-xl font-bold text-slate-900">Task not found or unauthorized</h2>
      <Link href="/tester/retesting" className="mt-6 text-indigo-600 font-medium hover:underline">
        Back to Retesting
      </Link>
    </div>
  );

  const issue = await Issue.findById(task.issueId);
  const testCase = await TestCase.findById(task.testCaseId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/tester/retesting" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Retesting Tasks
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-md text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm tracking-wider">
                  Retest Task
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-bold shadow-sm">
                  Issue #{issue?.issueNumber}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">Verify Fix: {issue?.title}</h1>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Developer Fix Note
                  </h3>
                  <div className="pl-8">
                    <div className="p-5 bg-indigo-50 rounded-lg text-sm text-indigo-950 whitespace-pre-wrap border border-indigo-100 font-medium shadow-sm leading-relaxed relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                      {issue?.fixNote || "No fix note provided. Please verify the issue is resolved."}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Original Bug Description
                  </h3>
                  <div className="pl-8">
                    <div className="p-5 bg-red-50 rounded-lg text-sm text-red-900 whitespace-pre-wrap border border-red-100 shadow-sm">
                      <span className="font-bold text-red-950 block mb-1 text-xs uppercase tracking-wide">Tester Note:</span>
                      <p className="mb-4">{issue?.description}</p>
                      
                      <span className="font-bold text-red-950 block mb-1 text-xs uppercase tracking-wide">Actual Result:</span>
                      <p>{issue?.actualResult}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Expected Result
                  </h3>
                  <div className="pl-8">
                    <div className="p-5 bg-green-50 rounded-lg text-sm text-green-900 whitespace-pre-wrap border border-green-200 shadow-sm">
                      {issue?.expectedResult}
                    </div>
                  </div>
                </div>
                
                {testCase && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                      <span className="w-6 border-t border-slate-300 mr-2"></span> Original Test Steps ({testCase.testCaseId})
                    </h3>
                    <div className="pl-8">
                      <div className="p-5 bg-slate-50 rounded-lg text-sm text-slate-800 whitespace-pre-wrap border border-slate-200 font-mono shadow-inner">
                        {testCase.steps}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <RetestForm retestTaskId={params.retestTaskId} currentStatus={task.status} />
        </div>
      </div>
    </div>
  );
}
