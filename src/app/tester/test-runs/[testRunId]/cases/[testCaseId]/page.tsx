import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestCase from "@/domain/models/TestCase";
import TestResult from "@/domain/models/TestResult";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import ExecutionForm from "./ExecutionForm";

export default async function TestExecutionPage({ params }: { params: Promise<{ testRunId: string, testCaseId: string }> }) {
  const session = await getServerSession(authOptions);
  const { testRunId, testCaseId } = await params;
  await dbConnect();

  const userId = (session?.user as any)?.id;
  const run = await TestRun.findOne({
    _id: testRunId,
    assignedTo: userId,
    testCaseIds: testCaseId,
  });

  if (!run) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-slate-900">Test case not assigned</h2>
      <p className="text-slate-500 mt-2">This case is not part of your assigned test run.</p>
      <Link href={`/tester/test-runs/${testRunId}`} className="mt-6 text-indigo-600 font-medium hover:underline">
        Back to Test Run
      </Link>
    </div>
  );
  
  const [testCase, existingResults] = await Promise.all([
    TestCase.findById(testCaseId),
    TestResult.find({ testRunId }).select("testCaseId").lean(),
  ]);

  if (!testCase) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-slate-900">Test case not found</h2>
      <Link href={`/tester/test-runs/${testRunId}`} className="mt-6 text-indigo-600 font-medium hover:underline">
        Back to Test Run
      </Link>
    </div>
  );

  const completedCaseIds = new Set(existingResults.map((result) => result.testCaseId.toString()));
  const orderedCaseIds = run.testCaseIds.map((id: unknown) => id?.toString()).filter(Boolean) as string[];
  const currentIndex = orderedCaseIds.indexOf(testCaseId);
  const nextTestCaseId = [
    ...orderedCaseIds.slice(currentIndex + 1),
    ...orderedCaseIds.slice(0, Math.max(currentIndex, 0)),
  ].find((id) => id !== testCaseId && !completedCaseIds.has(id));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href={`/tester/test-runs/${testRunId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Test Run
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">{testCase.testCaseId}</span>
                <span className="text-sm font-medium text-slate-500">{testCase.module}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  testCase.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                  testCase.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                  testCase.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-slate-100 text-slate-700'
                }`}>{testCase.priority || 'Normal'}</span>
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-8">{testCase.title}</h1>
              
              <div className="space-y-8">
                {testCase.preconditions && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                      <span className="w-6 border-t border-slate-300 mr-2"></span> Preconditions
                    </h3>
                    <div className="pl-8 text-sm text-slate-700 whitespace-pre-wrap">
                      {testCase.preconditions}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Test Steps
                  </h3>
                  <div className="pl-8">
                    <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-800 whitespace-pre-wrap border border-slate-200 font-mono shadow-inner">
                      {testCase.steps}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Expected Result
                  </h3>
                  <div className="pl-8">
                    <div className="p-4 bg-green-50 rounded-lg text-sm text-green-900 whitespace-pre-wrap border border-green-200 shadow-sm">
                      {testCase.expectedResult}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ExecutionForm 
            testRunId={testRunId} 
            projectId={testCase.projectId.toString()}
            testCaseId={testCaseId} 
            nextTestCaseId={nextTestCaseId}
          />
        </div>
      </div>
    </div>
  );
}
