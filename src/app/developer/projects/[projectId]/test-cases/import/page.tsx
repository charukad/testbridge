"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importTestCases } from "@/actions/testCaseActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";

export default function ImportTestCasesPage({ params }: { params: { projectId: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError("Error parsing CSV. Please check the format.");
          } else {
            setParsedData(results.data);
            setError("");
          }
        }
      });
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      setError("No valid data to import.");
      return;
    }
    setLoading(true);
    try {
      await importTestCases(params.projectId, parsedData);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/developer/projects/${params.projectId}/test-cases`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to import test cases.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Import Test Cases</h1>
          <p className="text-sm text-slate-500 mt-1">Upload a CSV file containing your test cases.</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-10">
              <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">Import Successful!</h3>
              <p className="text-slate-500 mt-2">Redirecting you back to test cases...</p>
            </div>
          ) : (
            <>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors relative">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={48} className="mx-auto text-violet-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Click or drag CSV file here</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Required columns: Test Case ID, Title, Test Steps, Expected Result
                </p>
                {file && (
                  <div className="mt-6 p-3 bg-violet-50 text-violet-700 rounded-md inline-block font-medium border border-violet-100">
                    Selected: {file.name} ({parsedData.length} records found)
                  </div>
                )}
              </div>

              {parsedData.length > 0 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Preview</h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {Object.keys(parsedData[0]).slice(0, 5).map(key => (
                            <th key={key} className="px-4 py-3 font-semibold">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedData.slice(0, 3).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).slice(0, 5).map((val: any, vIdx) => (
                              <td key={vIdx} className="px-4 py-3 truncate max-w-xs">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedData.length > 3 && <p className="text-xs text-slate-400 mt-2 text-right">Showing first 3 records...</p>}
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <Link href={`/developer/projects/${params.projectId}/test-cases`}>
                  <Button type="button" variant="outline" className="border-slate-300 text-slate-700">Cancel</Button>
                </Link>
                <Button 
                  onClick={handleImport} 
                  disabled={parsedData.length === 0 || loading}
                  className="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]"
                >
                  {loading ? "Importing..." : `Import ${parsedData.length} Records`}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
