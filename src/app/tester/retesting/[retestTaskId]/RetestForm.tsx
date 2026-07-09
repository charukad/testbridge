"use client";

import { useState } from "react";
import { submitRetest } from "@/actions/retestActions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Upload, Image as ImageIcon } from "lucide-react";

export default function RetestForm({ retestTaskId }: { retestTaskId: string }) {
  const [result, setResult] = useState<string>("Passed");
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
    formData.append("retestTaskId", retestTaskId);
    formData.append("result", result);
    
    files.forEach(f => {
      formData.append("screenshots", f);
    });

    try {
      await submitRetest(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Retest Result</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Is the issue fixed? *</label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setResult("Passed")}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${result === 'Passed' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <CheckCircle2 size={24} className={result === 'Passed' ? 'text-green-500' : 'text-slate-400'} /> Yes, Fixed
            </div>
            <div 
              onClick={() => setResult("Failed Again")}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${result === 'Failed Again' ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <XCircle size={24} className={result === 'Failed Again' ? 'text-red-500' : 'text-slate-400'} /> No, Still Broken
            </div>
          </div>
          {result === 'Passed' ? (
            <p className="text-xs text-green-600 mt-2 text-center">This will Close the issue.</p>
          ) : (
            <p className="text-xs text-red-600 mt-2 text-center">This will Reopen the issue and send it back to the developer.</p>
          )}
        </div>

        <div>
          <label htmlFor="testerNote" className="block text-sm font-medium text-slate-700 mb-1">Retest Notes</label>
          <textarea id="testerNote" name="testerNote" rows={3} placeholder="Add any details about your retest..." className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none"></textarea>
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

        <div className="pt-4 border-t border-slate-100">
          <Button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg">
            {loading ? "Submitting..." : "Submit Retest Result"}
          </Button>
        </div>
      </form>
    </div>
  );
}
