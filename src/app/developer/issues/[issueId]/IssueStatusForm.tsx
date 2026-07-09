"use client";

import { useState } from "react";
import { updateIssueStatus } from "@/actions/issueActions";
import { Button } from "@/components/ui/button";

export default function IssueStatusForm({ issueId, currentStatus }: { issueId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const isClosed = currentStatus === "Closed" || currentStatus === "Fixed" || currentStatus === "Retest Required";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("issueId", issueId);
    
    try {
      await updateIssueStatus(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Update Issue Status</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select 
            id="status" 
            name="status" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isClosed}
            className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Fixed">Fixed (Send for Retest)</option>
            <option value="Rejected">Rejected (Not a Bug)</option>
            <option value="Closed" disabled>Closed</option>
            <option value="Retest Required" disabled>Retest Required</option>
            <option value="Retesting" disabled>Retesting</option>
            <option value="Reopened">Reopened</option>
          </select>
        </div>

        <div>
          <label htmlFor="developerNote" className="block text-sm font-medium text-slate-700 mb-1">Developer Note</label>
          <textarea 
            id="developerNote" 
            name="developerNote" 
            rows={3} 
            placeholder="Add a note or comment on the issue..." 
            disabled={isClosed}
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none disabled:bg-slate-100"
          ></textarea>
        </div>

        {status === "Fixed" && (
          <div>
            <label htmlFor="fixNote" className="block text-sm font-medium text-slate-700 mb-1">Fix Note (Required for Tester)</label>
            <textarea 
              id="fixNote" 
              name="fixNote" 
              required
              rows={3} 
              placeholder="Explain how you fixed it so the tester knows what to verify..." 
              className="w-full px-4 py-2 border border-violet-300 rounded-md text-slate-900 resize-none ring-2 ring-violet-100"
            ></textarea>
            <p className="text-xs text-violet-600 mt-2">
              Marking as Fixed will automatically assign a Retest Task back to the original tester.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={loading || (isClosed && status === currentStatus)} 
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    </div>
  );
}
