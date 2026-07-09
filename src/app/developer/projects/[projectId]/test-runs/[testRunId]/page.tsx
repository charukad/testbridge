import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestCase from "@/domain/models/TestCase";
import TestResult from "@/domain/models/TestResult";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

function ResultBadge({ result }: { result?: string }) {
  const map: Record<string, string> = {
    Pass: "bg-green-100 text-green-700",
    Fail: "bg-red-100 text-red-700",
    Blocked: "bg-orange-100 text-orange-700",
    "Not Tested": "bg-slate-100 text-slate-600",
  };
  if (!result) return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-400">Not Started</span>;
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[result] || "bg-slate-100 text-slate-600"}`}>{result}</span>;
}

function getTesterName(result: any) {
  if (!result?.testerId) return "Not recorded";
  if (typeof result.testerId === "object" && "name" in result.testerId) {
    return result.testerId.name || "Unknown tester";
  }
  return "Unknown tester";
}

export default async function TestRunDetailDeveloperPage({ params }: { params: Promise<{ projectId: string; testRunId: string }> }) {
  await getServerSession(authOptions);
  const { projectId, testRunId } = await params;
  await dbConnect();

  const run = await TestRun.findOne({ _id: testRunId, projectId })
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name");

  if (!run) redirect(`/developer/projects/${projectId}/test-runs`);

  const [env, testCases, results] = await Promise.all([
    Environment.findById(run.environmentId),
    TestCase.find({ _id: { $in: run.testCaseIds } }),
    TestResult.find({ testRunId: run._id }).populate("testerId", "name"),
  ]);

  const getResult = (tcId: string) => results.find((result) => result.testCaseId.toString() === tcId);

  const passCount = results.filter((result) => result.result === "Pass").length;
  const failCount = results.filter((result) => result.result === "Fail").length;
  const blockedCount = results.filter((result) => result.result === "Blocked").length;
  const totalCount = run.testCaseIds.length;
  const doneCount = results.length;
  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const testerSummary = results.reduce<Record<string, {
    name: string;
    total: number;
    pass: number;
    fail: number;
    blocked: number;
    notTested: number;
  }>>((summary, result) => {
    const testerName = getTesterName(result);
    const key = result.testerId?._id?.toString?.() || testerName;

    if (!summary[key]) {
      summary[key] = {
        name: testerName,
        total: 0,
        pass: 0,
        fail: 0,
        blocked: 0,
        notTested: 0,
      };
    }

    summary[key].total += 1;
    if (result.result === "Pass") summary[key].pass += 1;
    if (result.result === "Fail") summary[key].fail += 1;
    if (result.result === "Blocked") summary[key].blocked += 1;
    if (result.result === "Not Tested") summary[key].notTested += 1;

    return summary;
  }, {});
  const testerSummaryRows = Object.values(testerSummary);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <Link href={`/developer/projects/${projectId}/test-runs`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Test Runs
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{run.name}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Assigned to <span className="font-semibold text-slate-700">{(run.assignedTo as any)?.name}</span> · Environment: <span className="font-semibold text-slate-700">{env?.name || "Unknown"}</span>
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${run.status === "Completed" ? "bg-green-100 text-green-700" : run.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
            {run.status}
          </span>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
          <span className="text-sm font-bold text-indigo-600">{doneCount}/{totalCount} cases · {progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: "Passed", value: passCount, color: "green" },
            { label: "Failed", value: failCount, color: "red" },
            { label: "Blocked", value: blockedCount, color: "orange" },
            { label: "Pending", value: totalCount - doneCount, color: "slate" },
          ].map((s) => (
            <div key={s.label} className={`bg-${s.color}-50 rounded-lg p-3 border border-${s.color}-100`}>
              <div className={`text-xl font-extrabold text-${s.color}-700`}>{s.value}</div>
              <div className={`text-xs font-semibold text-${s.color}-600 mt-0.5`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tester Completion Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">Tester Completion</h2>
          <p className="text-xs text-slate-500 mt-0.5">Count of submitted test results by tester for this run.</p>
        </div>
        {testerSummaryRows.length === 0 ? (
          <div className="p-6 text-sm text-slate-400 text-center">No tester submissions yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
            {testerSummaryRows.map((tester) => (
              <div key={tester.name} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tester.name}</p>
                    <p className="text-xs text-slate-500">{tester.total} completed result{tester.total === 1 ? "" : "s"}</p>
                  </div>
                  <span className="text-xl font-extrabold text-indigo-600">{tester.total}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                  <span className="rounded bg-green-50 text-green-700 py-1">P {tester.pass}</span>
                  <span className="rounded bg-red-50 text-red-700 py-1">F {tester.fail}</span>
                  <span className="rounded bg-orange-50 text-orange-700 py-1">B {tester.blocked}</span>
                  <span className="rounded bg-slate-50 text-slate-600 py-1">NT {tester.notTested}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Case Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">Test Case Results</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review each test case result submitted by the tester.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left font-bold">ID</th>
                <th className="px-5 py-3 text-left font-bold">Title</th>
                <th className="px-5 py-3 text-left font-bold">Module</th>
                <th className="px-5 py-3 text-left font-bold">Result</th>
                <th className="px-5 py-3 text-left font-bold">Executed By</th>
                <th className="px-5 py-3 text-left font-bold">Actual Result / Note</th>
                <th className="px-5 py-3 text-left font-bold">Screenshots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testCases.map((tc: any) => {
                const result = getResult(tc._id.toString());
                return (
                  <tr key={tc._id.toString()} className={`hover:bg-slate-50 transition-colors ${result?.result === "Fail" ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-700 text-xs bg-slate-100 px-2 py-0.5 rounded">{tc.testCaseId}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900 max-w-xs truncate">{tc.title}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{tc.module || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <ResultBadge result={result?.result} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {result ? getTesterName(result) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {result ? (
                        <div className="text-xs text-slate-600">
                          {result.actualResult && <p className="truncate"><span className="font-semibold">Actual:</span> {result.actualResult}</p>}
                          {result.note && <p className="truncate text-slate-400 mt-0.5"><span className="font-semibold">Note:</span> {result.note}</p>}
                          {!result.actualResult && !result.note && <span className="text-slate-400">No note</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {result?.screenshots?.length > 0 ? (
                        <div className="flex gap-1.5">
                          {result.screenshots.slice(0, 3).map((url: string, i: number) => (
                            <a href={url} target="_blank" rel="noreferrer" key={i}>
                              <img src={url} alt={`ss${i+1}`} className="w-10 h-10 object-cover rounded border border-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all" />
                            </a>
                          ))}
                          {result.screenshots.length > 3 && (
                            <span className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-semibold text-slate-500">
                              +{result.screenshots.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      {run.instructions && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Instructions for Tester</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{run.instructions}</p>
        </div>
      )}
    </div>
  );
}
