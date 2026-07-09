import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Upload, FileText } from "lucide-react";

export default async function TestCasesPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const testCases = await TestCase.find({ projectId: params.projectId }).sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={`/developer/projects/${params.projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" />
            Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Test Cases</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/developer/projects/${params.projectId}/test-cases/import`}>
            <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50 gap-2">
              <Upload size={16} />
              Import CSV
            </Button>
          </Link>
          <Link href={`/developer/projects/${params.projectId}/test-cases/new`}>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <PlusCircle size={16} />
              New Test Case
            </Button>
          </Link>
        </div>
      </div>

      {testCases.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No test cases found</h3>
          <p className="mt-1 text-slate-500">Create a new test case manually or import a batch via CSV.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Module</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {testCases.map((tc) => (
                <tr key={tc._id.toString()} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{tc.testCaseId}</td>
                  <td className="px-6 py-4">{tc.module || '-'}</td>
                  <td className="px-6 py-4 max-w-md truncate" title={tc.title}>{tc.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tc.priority === 'High' ? 'bg-red-100 text-red-700' :
                      tc.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {tc.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
