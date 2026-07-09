"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, MinusCircle, Upload, Image as ImageIcon, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExecutionForm({
  testRunId,
  projectId,
  testCaseId,
  nextTestCaseId,
}: {
  testRunId: string;
  projectId: string;
  testCaseId: string;
  nextTestCaseId?: string;
}) {
  const [result, setResult] = useState<string>("Pass");
  const [severity, setSeverity] = useState<string>("Low");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setErrorMessage("");
    setStatusMessage(files.length > 0 ? "Preparing screenshots..." : "Saving result...");
    setUploadProgress(files.length > 0 ? 5 : 35);
    
    const formData = new FormData(e.currentTarget);
    formData.delete("file-upload");
    formData.append("testRunId", testRunId);
    formData.append("projectId", projectId);
    formData.append("testCaseId", testCaseId);
    formData.append("result", result);
    
    if (result === "Fail") {
      formData.append("severity", severity);
    }
    
    files.forEach(f => {
      formData.append("screenshots", f);
    });

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 85);
      setUploadProgress(Math.max(10, Math.min(percent, 85)));
      setStatusMessage(files.length > 0 ? `Uploading screenshots... ${Math.min(percent, 85)}%` : "Sending result...");
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        setSaved(true);
        setStatusMessage(nextTestCaseId ? "Result saved. Opening next test..." : "Result saved. Returning to test run...");

        window.setTimeout(() => {
          router.push(nextTestCaseId ? `/tester/test-runs/${testRunId}/cases/${nextTestCaseId}` : `/tester/test-runs/${testRunId}`);
          router.refresh();
        }, 900);
        return;
      }

      let message = "Failed to save result. Please try again.";
      try {
        const response = JSON.parse(xhr.responseText) as { error?: string };
        if (response.error) message = response.error;
      } catch {
        // Keep default message if the server did not return JSON.
      }

      setErrorMessage(message);
      setStatusMessage("");
      setUploadProgress(0);
      setLoading(false);
    };

    xhr.onerror = () => {
      setErrorMessage("Network error while saving result. Please try again.");
      setStatusMessage("");
      setUploadProgress(0);
      setLoading(false);
    };

    xhr.open("POST", "/api/test-results");
    xhr.send(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Record Result</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Status <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => !loading && setResult("Pass")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Pass' ? 'border-green-500 bg-green-50 text-green-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <CheckCircle2 size={18} className={result === 'Pass' ? 'text-green-600' : 'text-slate-400'} /> Pass
            </div>
            <div 
              onClick={() => !loading && setResult("Fail")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Fail' ? 'border-red-500 bg-red-50 text-red-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <XCircle size={18} className={result === 'Fail' ? 'text-red-600' : 'text-slate-400'} /> Fail
            </div>
            <div 
              onClick={() => !loading && setResult("Blocked")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Blocked' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <AlertTriangle size={18} className={result === 'Blocked' ? 'text-orange-600' : 'text-slate-400'} /> Blocked
            </div>
            <div 
              onClick={() => !loading && setResult("Not Tested")}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${result === 'Not Tested' ? 'border-slate-400 bg-slate-50 text-slate-700 font-bold shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
            >
              <MinusCircle size={18} className={result === 'Not Tested' ? 'text-slate-500' : 'text-slate-400'} /> Not Tested
            </div>
          </div>
        </div>

        {result === "Fail" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Severity <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-2">
              {['Low', 'Medium', 'High', 'Critical'].map(sev => (
                <div 
                  key={sev}
                  onClick={() => !loading && setSeverity(sev)}
                  className={`text-center py-2 px-1 rounded-md border cursor-pointer text-xs font-semibold transition-all ${
                    severity === sev 
                      ? sev === 'Critical' ? 'bg-red-600 text-white border-red-600 shadow-md' :
                        sev === 'High' ? 'bg-orange-500 text-white border-orange-500 shadow-md' :
                        sev === 'Medium' ? 'bg-yellow-400 text-slate-900 border-yellow-400 shadow-md' :
                        'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sev}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="actualResult" className="block text-sm font-semibold text-slate-900 mb-1">
            Actual Result {result === 'Fail' && <span className="text-red-500">*</span>}
          </label>
          <textarea 
            id="actualResult" 
            name="actualResult" 
            rows={3} 
            placeholder="Describe what actually happened..." 
            required={result === 'Fail'} 
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-semibold text-slate-900 mb-1">Tester Note {result === 'Fail' && <span className="text-red-500">*</span>}</label>
          <textarea 
            id="note" 
            name="note" 
            rows={2} 
            placeholder="Any additional observations or steps to reproduce..." 
            required={result === 'Fail'}
            className="w-full px-4 py-2 border border-slate-300 rounded-md text-slate-900 resize-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">Screenshots</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors relative">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
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
                <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-sm text-slate-700 border border-slate-200 pr-1">
                  <ImageIcon size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(i)} disabled={loading} className="ml-1 p-0.5 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-40">
                    <XCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {result === "Fail" && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div>
              <strong>Automatic Issue Creation</strong>
              <p className="mt-1 opacity-90">Submitting a Fail result will automatically create a new bug report in the Developer Issue Board.</p>
            </div>
          </div>
        )}

        {(loading || saved) && (
          <div className={`p-4 rounded-lg border ${saved ? "bg-green-50 border-green-100 text-green-800" : "bg-indigo-50 border-indigo-100 text-indigo-800"}`}>
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <span>{statusMessage || "Saving result..."}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden border border-white">
              <div className={`h-full rounded-full transition-all ${saved ? "bg-green-500" : "bg-indigo-600"}`} style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <Button type="button" variant="outline" disabled={loading} onClick={() => router.push(`/tester/test-runs/${testRunId}`)} className="flex-1 bg-white text-slate-700 hover:bg-slate-50 border-slate-300">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2">
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={16} /> Save & Continue
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
