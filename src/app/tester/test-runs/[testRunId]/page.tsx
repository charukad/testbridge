import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestCase from "@/domain/models/TestCase";
import TestResult from "@/domain/models/TestResult";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Globe, Smartphone, Lock } from "lucide-react";

export default async function TestRunDetailPage({ params }: { params: { testRunId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const run = await TestRun.findOne({ 
    _id: params.testRunId,
    assignedTo: userId
  }).populate('projectId', 'name');

  if (!run) return <div>Test run not found or unauthorized.</div>;

  const env = await Environment.findById(run.environmentId);
  const testCases = await TestCase.find({ _id: { $in: run.testCaseIds } });
  const results = await TestResult.find({ testRunId: run._id });

  const getResultStatus = (tcId: string) => {
    const result = results.find(r => r.testCaseId.toString() === tcId.toString());
    return result ? result.result : "Pending";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/tester/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{run.name}</h1>
            <p className="text-slate-500 text-sm mb-6">{run.description || "No description provided."}</p>
            
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Test Cases</h3>
            <div className="space-y-3">
              {testCases.map((tc) => {
                const status = getResultStatus(tc._id.toString());
                const isCompleted = status !== "Pending";
                
                return (
                  <div key={tc._id.toString()} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {status === "Pass" && <CheckCircle2 className="text-green-500" size={20} />}
                        {status === "Fail" && <XCircle className="text-red-500" size={20} />}
                        {status === "Blocked" && <AlertTriangle className="text-orange-500" size={20} />}
                        {status === "Not Tested" && <MinusCircle className="text-slate-400" size={20} />}
                        {status === "Pending" && <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tc.testCaseId}: {tc.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{tc.preconditions}</p>
                      </div>
                    </div>
                    <div>
                      {!isCompleted ? (
                        <Link href={`/tester/test-runs/${run._id}/cases/${tc._id}`}>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                            <Play size={14} /> Execute
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-slate-500 px-3 py-1 bg-slate-100 rounded-md">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Environment Details</h3>
            {env ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Globe size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-500">App URL</p>
                    <a href={env.appUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-medium truncate hover:underline">{env.appUrl || 'N/A'}</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Lock size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Credentials</p>
                    <p className="font-medium text-slate-900">U: {env.username || 'N/A'} | P: {env.encryptedPassword || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Platform</p>
                    <p className="font-medium text-slate-900">{env.browser} {env.device ? `on ${env.device}` : ''}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Environment details unavailable.</p>
            )}
            
            {run.instructions && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Instructions</p>
                <div className="p-3 bg-yellow-50 rounded border border-yellow-100 text-sm text-yellow-800">
                  {run.instructions}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
