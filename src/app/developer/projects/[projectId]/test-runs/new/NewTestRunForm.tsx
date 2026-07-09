"use client";

import { useState } from "react";
import { createTestRun } from "@/actions/testRunActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock, Save } from "lucide-react";

type TestRunFormEnvironment = {
  _id: string;
  name: string;
};

type TestRunFormTester = {
  _id: string;
  name: string;
  email: string;
};

type TestRunFormCase = {
  _id: string;
  testCaseId: string;
  title: string;
  priority?: string;
};

type ActiveAssignment = {
  runName: string;
  status: string;
  testerName: string;
};

type NewTestRunFormProps = {
  projectId: string;
  environments: TestRunFormEnvironment[];
  testCases: TestRunFormCase[];
  testers: TestRunFormTester[];
  activeAssignmentsByCase: Record<string, ActiveAssignment>;
};

export default function NewTestRunForm({
  projectId,
  environments,
  testCases,
  testers,
  activeAssignmentsByCase,
}: NewTestRunFormProps) {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const availableCases = testCases.filter((tc) => !activeAssignmentsByCase[tc._id.toString()]);
  const assignedCount = testCases.length - availableCases.length;

  const handleToggleCase = (id: string) => {
    if (activeAssignmentsByCase[id]) return;

    setSelectedCases(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === availableCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(availableCases.map((tc) => tc._id.toString()));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // The actual submission is handled by the server action `createTestRun` on the form action
    // But setting loading to true here gives immediate feedback
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href={`/developer/projects/${projectId}/test-runs`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Test Runs
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h1 className="text-xl font-bold text-slate-900">Assign Test Run</h1>
          <p className="text-sm text-slate-500 mt-1">Select an environment, a tester, and assign test cases.</p>
        </div>
        
        <form action={createTestRun} onSubmit={handleSubmit} className="p-8">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="testCaseIds" value={JSON.stringify(selectedCases)} />
          
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-1">Test Run Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" required placeholder="e.g. Release 1.2 Regression" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-semibold text-slate-900 mb-1">Deadline</label>
                <input type="date" id="deadline" name="deadline" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="environmentId" className="block text-sm font-semibold text-slate-900 mb-1">Environment <span className="text-red-500">*</span></label>
                <select id="environmentId" name="environmentId" required className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900">
                  <option value="">Select an environment...</option>
                  {environments.map((env: any) => (
                    <option key={env._id} value={env._id}>{env.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-semibold text-slate-900 mb-1">Assign To Tester <span className="text-red-500">*</span></label>
                <select id="assignedTo" name="assignedTo" required className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900">
                  <option value="">Select a tester...</option>
                  {testers.map((t: any) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-1">Description / Notes</label>
              <textarea id="description" name="description" rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none"></textarea>
            </div>
            
            <div>
              <label htmlFor="instructions" className="block text-sm font-semibold text-slate-900 mb-1">Specific Instructions for Tester</label>
              <textarea id="instructions" name="instructions" rows={2} placeholder="Focus deeply on the payment flow..." className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none"></textarea>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Select Test Cases</h3>
              <div className="text-sm flex items-center">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mr-4">{selectedCases.length} Selected</span>
                {assignedCount > 0 && (
                  <span className="font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-md mr-4">
                    {assignedCount} Already Assigned
                  </span>
                )}
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
                  {selectedCases.length === availableCases.length ? "Deselect All" : "Select Available"}
                </Button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">Select</th>
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Title</th>
                    <th className="px-4 py-3 font-bold">Priority</th>
                    <th className="px-4 py-3 font-bold">Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {testCases.map((tc) => {
                    const id = tc._id.toString();
                    const activeAssignment = activeAssignmentsByCase[id];
                    const isAssigned = Boolean(activeAssignment);

                    return (
                      <tr 
                        key={tc._id} 
                        className={`transition-colors ${
                          isAssigned
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                            : `hover:bg-slate-50 cursor-pointer ${selectedCases.includes(id) ? "bg-indigo-50/50" : ""}`
                        }`}
                        onClick={() => handleToggleCase(id)}
                      >
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedCases.includes(id)}
                            disabled={isAssigned}
                            onChange={() => {}} // handled by row click
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:opacity-40"
                          />
                        </td>
                        <td className={`px-4 py-3 font-bold ${isAssigned ? "text-slate-400" : "text-slate-900"}`}>{tc.testCaseId}</td>
                        <td className={`px-4 py-3 truncate max-w-md font-medium ${isAssigned ? "text-slate-400" : "text-slate-800"}`}>{tc.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            tc.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            tc.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            tc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {tc.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {activeAssignment ? (
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded">
                              <Lock size={12} />
                              <span>{activeAssignment.testerName} · {activeAssignment.runName}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded">Available</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {testCases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                        No test cases available in this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href={`/developer/projects/${projectId}/test-runs`}>
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Cancel</Button>
            </Link>
            <Button type="submit" disabled={selectedCases.length === 0 || loading} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
