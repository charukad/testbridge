"use client";

import { createTestCase } from "@/actions/testCaseActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTestCasePage({ params }: { params: { projectId: string } }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/developer/projects/${params.projectId}/test-cases`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Test Cases
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Create Test Case</h1>
        </div>
        
        <form action={createTestCase} className="p-6 space-y-6">
          <input type="hidden" name="projectId" value={params.projectId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="testCaseId" className="block text-sm font-medium text-slate-700 mb-1">Test Case ID *</label>
              <input type="text" id="testCaseId" name="testCaseId" required placeholder="TC-001" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900" />
            </div>
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-slate-700 mb-1">Module</label>
              <input type="text" id="module" name="module" placeholder="e.g. Authentication" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900" />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input type="text" id="title" name="title" required placeholder="Verify successful login with valid credentials" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select id="priority" name="priority" className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select id="type" name="type" className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                <option value="Functional">Functional</option>
                <option value="UI">UI</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="preconditions" className="block text-sm font-medium text-slate-700 mb-1">Preconditions</label>
            <textarea id="preconditions" name="preconditions" rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
          </div>
          
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-slate-700 mb-1">Test Steps *</label>
            <textarea id="steps" name="steps" required rows={4} placeholder="1. Go to /login&#10;2. Enter email and password&#10;3. Click Login" className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
          </div>
          
          <div>
            <label htmlFor="expectedResult" className="block text-sm font-medium text-slate-700 mb-1">Expected Result *</label>
            <textarea id="expectedResult" name="expectedResult" required rows={3} placeholder="User is redirected to the dashboard." className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link href={`/developer/projects/${params.projectId}/test-cases`}>
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">Save Test Case</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
