import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { ArrowLeft, Bug } from "lucide-react";
import IssueStatusForm from "./IssueStatusForm";

export default async function IssueDetailPage({ params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = await params;
  await dbConnect();
  
  const issue = await Issue.findById(issueId)
    .populate('projectId', 'name')
    .populate('reportedBy', 'name email');

  if (!issue) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Bug className="text-red-500 w-12 h-12 mb-4 opacity-50" />
      <h2 className="text-xl font-bold text-slate-900">Issue not found</h2>
      <Link href="/developer/issues" className="mt-6 text-indigo-600 font-medium hover:underline">
        Back to Issue Board
      </Link>
    </div>
  );

  const testCase = await TestCase.findById(issue.testCaseId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/developer/issues" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Issue Board
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm">
                  <Bug size={14} /> Issue #{issue.issueNumber}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold shadow-sm">
                  {issue.projectId?.name || "Unknown Project"}
                </span>
              </div>
              {issue.status === 'Reopened' && (
                <span className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold shadow-sm animate-pulse shadow-red-600/30">
                  Reopened ({issue.retestCount} times)
                </span>
              )}
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-8">{issue.title}</h1>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Tester&apos;s Note & Actual Result
                  </h3>
                  <div className="pl-8">
                    <div className="p-5 bg-red-50 rounded-lg text-sm text-red-900 whitespace-pre-wrap border border-red-100 shadow-sm leading-relaxed">
                      <span className="font-bold text-red-950 block mb-1 text-xs uppercase tracking-wide">Note:</span>
                      <p className="mb-4">{issue.description || "No note provided."}</p>
                      
                      <span className="font-bold text-red-950 block mb-1 text-xs uppercase tracking-wide">Actual Result:</span>
                      <p>{issue.actualResult || "No actual result provided."}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                    <span className="w-6 border-t border-slate-300 mr-2"></span> Expected Result (From Test Case)
                  </h3>
                  <div className="pl-8">
                    <div className="p-5 bg-green-50 rounded-lg text-sm text-green-900 whitespace-pre-wrap border border-green-200 shadow-sm">
                      {issue.expectedResult || "No expected result recorded."}
                    </div>
                  </div>
                </div>

                {issue.screenshots && issue.screenshots.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                      <span className="w-6 border-t border-slate-300 mr-2"></span> Proof Screenshots
                    </h3>
                    <div className="pl-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {issue.screenshots.map((url: string, i: number) => (
                          <a href={url} target="_blank" rel="noreferrer" key={i} className="block border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2">
                            <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-auto object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {testCase && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                      <span className="w-6 border-t border-slate-300 mr-2"></span> Steps to Reproduce
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

        <div>
          <IssueStatusForm issueId={issue._id.toString()} currentStatus={issue.status as string} />
        </div>
      </div>
    </div>
  );
}
