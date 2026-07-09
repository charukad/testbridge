import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { ArrowLeft, Bug } from "lucide-react";
import IssueStatusForm from "./IssueStatusForm";

export default async function IssueDetailPage({ params }: { params: { issueId: string } }) {
  await dbConnect();
  
  const issue = await Issue.findById(params.issueId)
    .populate('projectId', 'name')
    .populate('reportedBy', 'name email');

  if (!issue) return <div>Issue not found.</div>;

  const testCase = await TestCase.findById(issue.testCaseId);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/developer/issues" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Bug Board
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase flex items-center gap-1">
                <Bug size={12} /> Issue #{issue.issueNumber}
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                {issue.projectId?.name || "Unknown Project"}
              </span>
              {issue.status === 'Reopened' && (
                <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold animate-pulse">
                  Reopened ({issue.retestCount} times)
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{issue.title}</h1>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Tester's Note / Actual Result</h3>
                <div className="p-4 bg-red-50 rounded-lg text-sm text-red-900 whitespace-pre-wrap border border-red-100">
                  <span className="font-semibold block mb-1">Note:</span>
                  {issue.description || "No note provided."}
                  
                  <span className="font-semibold block mt-4 mb-1">Actual Result:</span>
                  {issue.actualResult || "No actual result provided."}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Expected Result (From Test Case)</h3>
                <div className="p-4 bg-emerald-50 rounded-lg text-sm text-emerald-900 whitespace-pre-wrap border border-emerald-100">
                  {issue.expectedResult || "No expected result recorded."}
                </div>
              </div>

              {issue.screenshots && issue.screenshots.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Proof Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issue.screenshots.map((url: string, i: number) => (
                      <a href={url} target="_blank" rel="noreferrer" key={i} className="block border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-auto object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {testCase && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Test Steps</h3>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap border border-slate-200 font-mono">
                    {testCase.steps}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <IssueStatusForm issueId={issue._id.toString()} currentStatus={issue.status as string} />
        </div>
      </div>
    </div>
  );
}
