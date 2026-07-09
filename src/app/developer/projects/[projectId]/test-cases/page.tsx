import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import TestCase from "@/domain/models/TestCase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Upload, FileText, Search, Filter } from "lucide-react";

export default async function TestCasesPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const testCases = await TestCase.find({ projectId: params.projectId }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Link href={`/developer/projects/${params.projectId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Test Cases</h1>
          <p className="text-sm text-slate-500 mt-1">Manage test scenarios, steps, and expected outcomes.</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/developer/projects/${params.projectId}/test-cases/import`}>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2 bg-white shadow-sm">
              <Upload size={16} />
              Import CSV
            </Button>
          </Link>
          <Link href={`/developer/projects/${params.projectId}/test-cases/new`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
              <PlusCircle size={16} />
              New Test Case
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search test cases by ID or title..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-600 gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>

        {testCases.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No test cases found</h3>
            <p className="text-sm text-slate-500">Create a new test case manually or import a batch via CSV.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Module</th>
                  <th className="px-6 py-4 font-bold">Title</th>
                  <th className="px-6 py-4 font-bold">Priority</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {testCases.map((tc) => (
                  <tr key={tc._id.toString()} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap group-hover:text-indigo-600 transition-colors">{tc.testCaseId}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">{tc.module || '-'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-md truncate font-medium text-slate-800" title={tc.title}>{tc.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        tc.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        tc.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        tc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tc.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        tc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tc.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
