import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Globe, Smartphone, Lock } from "lucide-react";

export default async function EnvironmentsPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const environments = await Environment.find({ projectId: params.projectId }).sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href={`/developer/projects/${params.projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors mb-2">
            <ArrowLeft size={16} className="mr-1" />
            Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Environments</h1>
        </div>
        <Link href={`/developer/projects/${params.projectId}/environments/new`}>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <PlusCircle size={16} />
            New Environment
          </Button>
        </Link>
      </div>

      {environments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <Globe size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No environments</h3>
          <p className="mt-1 text-slate-500">Create a testing environment like Staging or Production.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {environments.map((env) => (
            <div key={env._id.toString()} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-900">{env.name}</h3>
                {env.buildVersion && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                    Build: {env.buildVersion}
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-1 mb-6">
                {env.appUrl && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Globe size={16} className="text-slate-400" />
                    <a href={env.appUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                      {env.appUrl}
                    </a>
                  </div>
                )}
                {(env.browser || env.device) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Smartphone size={16} className="text-slate-400" />
                    <span>{env.browser} {env.device ? `- ${env.device}` : ''}</span>
                  </div>
                )}
                {env.username && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Lock size={16} className="text-slate-400" />
                    <span>User: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{env.username}</code></span>
                  </div>
                )}
              </div>

              {env.instructions && (
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Instructions</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{env.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
