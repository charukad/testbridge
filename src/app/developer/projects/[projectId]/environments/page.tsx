import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Globe, Smartphone, Lock, ExternalLink } from "lucide-react";

export default async function EnvironmentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  await getServerSession(authOptions);
  const { projectId } = await params;
  await dbConnect();
  
  const environments = await Environment.find({ projectId }).sort({ createdAt: -1 });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Link href={`/developer/projects/${projectId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-3">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Environments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage testing environments, URLs, and test credentials.</p>
        </div>
        <Link href={`/developer/projects/${projectId}/environments/new`}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm">
            <PlusCircle size={16} />
            New Environment
          </Button>
        </Link>
      </div>

      {environments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
            <Globe size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No environments</h3>
          <p className="text-sm text-slate-500 mb-6">Create a testing environment like Staging or Production.</p>
          <Link href={`/developer/projects/${projectId}/environments/new`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">Create Environment</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {environments.map((env) => (
            <div key={env._id.toString()} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900">{env.name}</h3>
                {env.buildVersion && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    Build: {env.buildVersion}
                  </span>
                )}
              </div>
              
              <div className="p-6 space-y-4 flex-1">
                {env.appUrl && (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <Globe size={14} className="mr-1.5" /> App URL
                    </div>
                    <a href={env.appUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline flex items-center break-all">
                      {env.appUrl} <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-4">
                  {(env.browser || env.device) && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                        <Smartphone size={14} className="mr-1.5" /> Target Device
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {env.browser} {env.device ? `• ${env.device}` : ''}
                      </div>
                    </div>
                  )}
                  {env.username && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                        <Lock size={14} className="mr-1.5" /> Credentials
                      </div>
                      <div className="text-sm font-medium text-slate-900 flex items-center">
                        <span className="text-slate-500 mr-1">User:</span>
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{env.username}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {env.instructions && (
                <div className="p-5 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instructions</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{env.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
