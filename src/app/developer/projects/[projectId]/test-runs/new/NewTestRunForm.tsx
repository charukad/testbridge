"use client";

import { useState } from "react";
import { createTestRun } from "@/actions/testRunActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTestRunForm({ projectId, environments, testCases, testers }: any) {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const handleToggleCase = (id: string) => {
    setSelectedCases(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === testCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(testCases.map((tc: any) => tc._id.toString()));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href={`/developer/projects/${projectId}/test-runs`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Test Runs
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assign Test Run</h1>
            <p className="text-sm text-slate-500 mt-1">Select an environment, a tester, and assign test cases.</p>
          </div>
        </div>
        
        <form action={createTestRun} className="p-6">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="testCaseIds" value={JSON.stringify(selectedCases)} />
          
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Test Run Name *</label>
                <input type="text" id="name" name="name" required placeholder="e.g. Release 1.2 Regression" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900" />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input type="date" id="deadline" name="deadline" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="environmentId" className="block text-sm font-medium text-slate-700 mb-1">Environment *</label>
                <select id="environmentId" name="environmentId" required className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                  <option value="">Select an environment...</option>
                  {environments.map((env: any) => (
                    <option key={env._id} value={env._id}>{env.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700 mb-1">Assign To Tester *</label>
                <select id="assignedTo" name="assignedTo" required className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                  <option value="">Select a tester...</option>
                  {testers.map((t: any) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description / Notes</label>
              <textarea id="description" name="description" rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
            </div>
            
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-slate-700 mb-1">Specific Instructions for Tester</label>
              <textarea id="instructions" name="instructions" rows={2} placeholder="Focus deeply on the payment flow..." className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Select Test Cases</h3>
              <div className="text-sm">
                <span className="font-semibold text-violet-600 mr-4">{selectedCases.length} Selected</span>
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedCases.length === testCases.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 w-12"></th>
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {testCases.map((tc: any) => (
                    <tr 
                      key={tc._id} 
                      className={`hover:bg-slate-50 cursor-pointer ${selectedCases.includes(tc._id.toString()) ? 'bg-violet-50/50' : ''}`}
                      onClick={() => handleToggleCase(tc._id.toString())}
                    >
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedCases.includes(tc._id.toString())}
                          onChange={() => {}} // handled by row click
                          className="w-4 h-4 text-violet-600 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{tc.testCaseId}</td>
                      <td className="px-4 py-3 truncate max-w-sm">{tc.title}</td>
                      <td className="px-4 py-3">{tc.priority || 'Normal'}</td>
                    </tr>
                  ))}
                  {testCases.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No test cases available in this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link href={`/developer/projects/${projectId}/test-runs`}>
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white" disabled={selectedCases.length === 0}>
              Create Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
