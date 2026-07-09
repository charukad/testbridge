import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ExecutionForm from "./ExecutionForm";

export default async function TestExecutionPage({ params }: { params: { testRunId: string, testCaseId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const testCase = await TestCase.findById(params.testCaseId);
  if (!testCase) return <div>Test case not found.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href={`/tester/test-runs/${params.testRunId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Test Run
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{testCase.testCaseId}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                  testCase.priority === 'High' ? 'bg-red-100 text-red-700' :
                  testCase.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-700'
                }`}>{testCase.priority || 'Normal'} Priority</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{testCase.title}</h1>
            
            <div className="space-y-6">
              {testCase.preconditions && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Preconditions</h3>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap border border-slate-200">
                    {testCase.preconditions}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Test Steps</h3>
                <div className="p-4 bg-violet-50 rounded-lg text-sm text-violet-900 whitespace-pre-wrap border border-violet-100 font-mono">
                  {testCase.steps}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Expected Result</h3>
                <div className="p-4 bg-emerald-50 rounded-lg text-sm text-emerald-900 whitespace-pre-wrap border border-emerald-100">
                  {testCase.expectedResult}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ExecutionForm 
            testRunId={params.testRunId} 
            projectId={testCase.projectId.toString()}
            testCaseId={params.testCaseId} 
          />
        </div>
      </div>
    </div>
  );
}
