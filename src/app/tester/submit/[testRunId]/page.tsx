import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestResult from "@/domain/models/TestResult";
import Link from "next/link";
import { submitTestRun } from "@/actions/testRunActions";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubmitTestRunPage({ params }: { params: { testRunId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const run = await TestRun.findOne({ 
    _id: params.testRunId,
    assignedTo: userId
  }).populate('projectId', 'name');

  if (!run) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-slate-900">Test run not found</h2>
      <Link href="/tester/tasks" className="mt-6 text-indigo-600 font-medium hover:underline">
        Return to My Tasks
      </Link>
    </div>
  );

  const results = await TestResult.find({ testRunId: run._id });
  
  const completedCount = results.length;
  const totalCount = run.testCaseIds.length;
  
  const notTestedCount = totalCount - completedCount + results.filter(r => r.result === "Not Tested").length;
  const passedCount = results.filter(r => r.result === "Pass").length;
  const failedCount = results.filter(r => r.result === "Fail").length;
  const blockedCount = results.filter(r => r.result === "Blocked").length;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <Link href={`/tester/test-runs/${params.testRunId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Test Run
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-900 text-center">Submit Test Run</h1>
          <p className="text-center text-slate-500 mt-2">You are about to submit <span className="font-semibold text-slate-700">{run.name}</span></p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-center">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                <div className="text-3xl font-bold text-slate-900 mb-1">{totalCount}</div>
                <div className="text-xs uppercase font-semibold text-slate-500">Total</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <div className="text-3xl font-bold text-green-700 mb-1">{passedCount}</div>
                <div className="text-xs uppercase font-semibold text-green-600">Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                <div className="text-3xl font-bold text-red-700 mb-1">{failedCount}</div>
                <div className="text-xs uppercase font-semibold text-red-600">Failed</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100">
                <div className="text-3xl font-bold text-orange-700 mb-1">{blockedCount}</div>
                <div className="text-xs uppercase font-semibold text-orange-600">Blocked</div>
              </div>
            </div>
          </div>

          {notTestedCount > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-8 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
              <div>
                <strong className="block text-yellow-900 mb-1">Warning: Incomplete Test Run</strong>
                <p>You still have <span className="font-bold">{notTestedCount}</span> test cases that are either pending or marked as 'Not Tested'. Do you want to submit anyway?</p>
              </div>
            </div>
          )}

          <form action={async () => {
            "use server";
            await submitTestRun(run._id.toString());
          }}>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01]">
              <Send size={20} /> Confirm & Submit Test Run
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
