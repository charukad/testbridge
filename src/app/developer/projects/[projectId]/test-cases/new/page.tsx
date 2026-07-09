"use client";

import { createTestCase } from "@/actions/testCaseActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTestCasePage({ params }: { params: { projectId: string } }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createTestCase(formData);
      router.push(`/developer/projects/${params.projectId}/test-cases`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/developer/projects/${params.projectId}/test-cases`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Test Cases
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create Test Case</h1>
            <p className="text-sm text-slate-500 mt-1">Define steps and expected results for a test scenario.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <input type="hidden" name="projectId" value={params.projectId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="testCaseId" className="block text-sm font-semibold text-slate-900 mb-1">Test Case ID <span className="text-red-500">*</span></label>
              <input type="text" id="testCaseId" name="testCaseId" required placeholder="TC-001" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
            </div>
            <div>
              <label htmlFor="module" className="block text-sm font-semibold text-slate-900 mb-1">Module</label>
              <input type="text" id="module" name="module" placeholder="e.g. Authentication" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-1">Title <span className="text-red-500">*</span></label>
            <input type="text" id="title" name="title" required placeholder="Verify successful login with valid credentials" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-slate-900 mb-1">Priority</label>
              <select id="priority" name="priority" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900">
                <option value="Low">Low</option>
                <option value="Medium" defaultValue="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-slate-900 mb-1">Type</label>
              <select id="type" name="type" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900">
                <option value="Functional">Functional</option>
                <option value="UI">UI</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="preconditions" className="block text-sm font-semibold text-slate-900 mb-1">Preconditions</label>
            <textarea id="preconditions" name="preconditions" rows={2} placeholder="Any setup required before executing the test..." className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none"></textarea>
          </div>
          
          <div>
            <label htmlFor="steps" className="block text-sm font-semibold text-slate-900 mb-1">Test Steps <span className="text-red-500">*</span></label>
            <textarea id="steps" name="steps" required rows={4} placeholder="1. Go to /login&#10;2. Enter email and password&#10;3. Click Login" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none font-mono"></textarea>
          </div>
          
          <div>
            <label htmlFor="expectedResult" className="block text-sm font-semibold text-slate-900 mb-1">Expected Result <span className="text-red-500">*</span></label>
            <textarea id="expectedResult" name="expectedResult" required rows={3} placeholder="User is successfully authenticated and redirected to the dashboard." className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none"></textarea>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link href={`/developer/projects/${params.projectId}/test-cases`}>
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? "Saving..." : "Save Test Case"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
