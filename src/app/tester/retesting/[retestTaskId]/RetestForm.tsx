"use client";

import { useState } from "react";
import { submitRetest } from "@/actions/retestActions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Upload, Image as ImageIcon, Send } from "lucide-react";

export default function RetestForm({ retestTaskId, currentStatus }: { retestTaskId: string, currentStatus?: string }) {
  const [result, setResult] = useState<string>("Passed");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const isCompleted = currentStatus === "Passed" || currentStatus === "Failed Again";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCompleted) return;
    
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("retestTaskId", retestTaskId);
    formData.append("result", result);
    
    files.forEach(f => {
      formData.append("screenshots", f);
    });

    try {
      await submitRetest(formData);
      // Wait for server action to handle redirect/revalidation
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900">Retest Result</h2>
      </div>
      
      {isCompleted ? (
        <div className="p-8 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            currentStatus === 'Passed' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
          }`}>
            {currentStatus === 'Passed' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Retest Completed</h3>
          <p className="text-sm text-slate-500">
            You marked this retest as <span className="font-bold">{currentStatus}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Is the issue fixed? <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setResult("Passed")}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${result === 'Passed' ? 'border-green-500 bg-green-50 text-green-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
              >
                <CheckCircle2 size={24} className={result === 'Passed' ? 'text-green-500' : 'text-slate-400'} /> Yes, Fixed
              </div>
              <div 
                onClick={() => setResult("Failed Again")}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${result === 'Failed Again' ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
              >
                <XCircle size={24} className={result === 'Failed Again' ? 'text-red-500' : 'text-slate-400'} /> No, Broken
              </div>
            </div>
            
            <div className="mt-3">
              {result === 'Passed' ? (
                <div className="bg-green-50 p-2 rounded text-xs font-medium text-green-700 text-center animate-in fade-in slide-in-from-top-1">
                  This will officially Close the issue.
                </div>
              ) : (
                <div className="bg-red-50 p-2 rounded text-xs font-medium text-red-700 text-center animate-in fade-in slide-in-from-top-1">
                  This will Reopen the issue and send it back.
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="testerNote" className="block text-sm font-semibold text-slate-900 mb-1">Retest Notes</label>
            <textarea id="testerNote" name="testerNote" rows={3} placeholder="Add any details about your retest..." className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 resize-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">Proof Screenshots</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors relative group">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-md text-sm text-indigo-700 border border-indigo-100 shadow-sm">
                    <ImageIcon size={14} className="text-indigo-500" />
                    <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold flex items-center justify-center gap-2 shadow-md">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
              {loading ? "Submitting..." : "Submit Retest Result"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
