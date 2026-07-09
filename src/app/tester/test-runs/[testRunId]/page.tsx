import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestCase from "@/domain/models/TestCase";
import TestResult from "@/domain/models/TestResult";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Globe, Smartphone, Lock, Send } from "lucide-react";

export default async function TestRunDetailPage({ params }: { params: Promise<{ testRunId: string }> }) {
  const session = await getServerSession(authOptions);
  const { testRunId } = await params;
  await dbConnect();
  
  const userId = (session?.user as any)?.id;
  
  const run = await TestRun.findOne({ 
    _id: testRunId,
    assignedTo: userId
  }).populate('projectId', 'name');

  if (!run) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold text-slate-900">Test run not found</h2>
      <p className="text-slate-500 mt-2">The test run may have been deleted or is not assigned to you.</p>
      <Link href="/tester/tasks" className="mt-6 text-indigo-600 font-medium hover:underline">
        Return to My Tasks
      </Link>
    </div>
  );

  const env = await Environment.findById(run.environmentId);
  const testCases = await TestCase.find({ _id: { $in: run.testCaseIds } }).lean();
  const results = await TestResult.find({ testRunId: run._id }).lean();

  const getResultStatus = (tcId: string) => {
    const result = results.find(r => r.testCaseId.toString() === tcId.toString());
    return result ? result.result : "Pending";
  };

  const completedCount = results.length;
  const totalCount = run.testCaseIds.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const passedCount = results.filter(r => r.result === "Pass").length;
  const failedCount = results.filter(r => r.result === "Fail").length;
  const blockedCount = results.filter(r => r.result === "Blocked").length;
  const notTestedCount = results.filter(r => r.result === "Not Tested").length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/tester/tasks" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Tasks
        </Link>
        {run.status !== 'Completed' && run.status !== 'Submitted' && (
          <Link href={`/tester/submit/${run._id}`}>
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              <Send size={16} className="mr-2" />
              Submit Test Run
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{run.name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  run.status === 'Pending' ? 'bg-slate-100 text-slate-700' : 
                  run.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {run.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6">{run.description || "No description provided."}</p>
              
              {/* Progress Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-white rounded p-2 border border-slate-100 shadow-sm">
                    <div className="text-lg font-bold text-slate-900">{totalCount}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500">Total</div>
                  </div>
                  <div className="bg-green-50 rounded p-2 border border-green-100">
                    <div className="text-lg font-bold text-green-700">{passedCount}</div>
                    <div className="text-[10px] uppercase font-semibold text-green-600">Passed</div>
                  </div>
                  <div className="bg-red-50 rounded p-2 border border-red-100">
                    <div className="text-lg font-bold text-red-700">{failedCount}</div>
                    <div className="text-[10px] uppercase font-semibold text-red-600">Failed</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2 border border-orange-100">
                    <div className="text-lg font-bold text-orange-700">{blockedCount}</div>
                    <div className="text-[10px] uppercase font-semibold text-orange-600">Blocked</div>
                  </div>
                  <div className="bg-slate-100 rounded p-2 border border-slate-200">
                    <div className="text-lg font-bold text-slate-700">{pendingCount + notTestedCount}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-600">Pending</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Test Cases</h3>
              
              <div className="space-y-3">
                {testCases.map((tc) => {
                  const status = getResultStatus(tc._id.toString());
                  const isCompleted = status !== "Pending";
                  
                  return (
                    <div key={tc._id.toString()} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:border-indigo-300 transition-colors shadow-sm group">
                      <div className="flex items-start gap-3 mb-4 sm:mb-0">
                        <div className="mt-1 shrink-0">
                          {status === "Pass" && <CheckCircle2 className="text-green-500" size={20} />}
                          {status === "Fail" && <XCircle className="text-red-500" size={20} />}
                          {status === "Blocked" && <AlertTriangle className="text-orange-500" size={20} />}
                          {status === "Not Tested" && <MinusCircle className="text-slate-400" size={20} />}
                          {status === "Pending" && <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{tc.testCaseId}</span>
                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{tc.module}</span>
                            {tc.priority === 'High' || tc.priority === 'Critical' ? (
                              <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">High Priority</span>
                            ) : null}
                          </div>
                          <p className="font-semibold text-slate-900">{tc.title}</p>
                        </div>
                      </div>
                      
                      <div className="shrink-0 sm:ml-4 flex items-center justify-end">
                        {!isCompleted ? (
                          <Link href={`/tester/test-runs/${run._id}/cases/${tc._id}`}>
                            <button className="flex items-center bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm group-hover:bg-indigo-50">
                              <Play size={14} className="mr-1.5" /> Execute
                            </button>
                          </Link>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className={`text-sm font-medium px-2.5 py-1 rounded-md ${
                              status === 'Pass' ? 'bg-green-50 text-green-700' :
                              status === 'Fail' ? 'bg-red-50 text-red-700' :
                              status === 'Blocked' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {status}
                            </span>
                            {run.status !== 'Completed' && run.status !== 'Submitted' && (
                              <Link href={`/tester/test-runs/${run._id}/cases/${tc._id}`}>
                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline">
                                  Edit
                                </button>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Environment</h3>
            </div>
            <div className="p-5">
              {env ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                      <Globe size={14} className="mr-1.5" /> App URL
                    </div>
                    <a href={env.appUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline break-all">{env.appUrl || 'N/A'}</a>
                  </div>
                  
                  {env.apiBaseUrl && (
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                        <Globe size={14} className="mr-1.5" /> API Base URL
                      </div>
                      <div className="text-sm font-medium text-slate-900 break-all">{env.apiBaseUrl}</div>
                    </div>
                  )}

                  {(env.username || env.encryptedPassword) && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="text-xs font-medium text-slate-500 mb-2 flex items-center">
                        <Lock size={14} className="mr-1.5" /> Test Credentials
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs block">Username</span>
                          <span className="font-mono font-medium text-slate-900">{env.username || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Password</span>
                          <span className="font-mono font-medium text-slate-900">{env.encryptedPassword || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                        <Smartphone size={14} className="mr-1.5" /> Browser
                      </div>
                      <div className="text-sm font-medium text-slate-900">{env.browser || 'N/A'}</div>
                    </div>
                    {env.device && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1 flex items-center">
                          <Smartphone size={14} className="mr-1.5" /> Device
                        </div>
                        <div className="text-sm font-medium text-slate-900">{env.device}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Environment details unavailable.</p>
              )}
            </div>
          </div>
            
          {run.instructions && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Instructions</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{run.instructions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
