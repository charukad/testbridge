"use client";

import { useState } from "react";
import { submitTestResult } from "@/actions/testResultActions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, MinusCircle, Upload, Image as ImageIcon } from "lucide-react";

export default function ExecutionForm({ testRunId, projectId, testCaseId }: { testRunId: string, projectId: string, testCaseId: string }) {
  const [result, setResult] = useState<string>("Pass");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("testRunId", testRunId);
    formData.append("projectId", projectId);
    formData.append("testCaseId", testCaseId);
    formData.append("result", result);
    
    files.forEach(f => {
      formData.append("screenshots", f);
    });

    try {
      await submitTestResult(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Record Result</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Status *</label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setResult("Pass")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Pass' ? 'border-green-500 bg-green-50 text-green-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <CheckCircle2 size={18} className={result === 'Pass' ? 'text-green-500' : 'text-slate-400'} /> Pass
            </div>
            <div 
              onClick={() => setResult("Fail")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Fail' ? 'border-red-500 bg-red-50 text-red-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <XCircle size={18} className={result === 'Fail' ? 'text-red-500' : 'text-slate-400'} /> Fail
            </div>
            <div 
              onClick={() => setResult("Blocked")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Blocked' ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <AlertTriangle size={18} className={result === 'Blocked' ? 'text-orange-500' : 'text-slate-400'} /> Blocked
            </div>
            <div 
              onClick={() => setResult("Not Tested")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Not Tested' ? 'border-slate-500 bg-slate-100 text-slate-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <MinusCircle size={18} className={result === 'Not Tested' ? 'text-slate-500' : 'text-slate-400'} /> Skip
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="actualResult" className="block text-sm font-medium text-slate-700 mb-1">Actual Result</label>
          <textarea id="actualResult" name="actualResult" rows={3} placeholder="What actually happened? (Required if Failed)" required={result === 'Fail'} className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1">Testing Notes</label>
          <textarea id="note" name="note" rows={2} placeholder="Any additional observations..." className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Proof Screenshots</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors relative">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500">
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-sm text-slate-700 border border-slate-200">
                  <ImageIcon size={14} className="text-violet-500" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {result === "Fail" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>Note:</strong> Submitting a Fail result will automatically create a new Issue for the developers in the Bug Board.
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <Button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg">
            {loading ? "Submitting..." : "Submit Result"}
          </Button>
        </div>
      </form>
    </div>
  );
}
