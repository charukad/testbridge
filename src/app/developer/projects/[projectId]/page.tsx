import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Server, FileText, PlayCircle, ArrowLeft, Settings } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  const project = await Project.findOne({ 
    _id: params.projectId,
    createdBy: (session?.user as any)?.id 
  });

  if (!project) {
    redirect("/developer/projects");
  }

  const envCount = await Environment.countDocuments({ projectId: project._id });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/developer/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <p className="text-slate-500 mt-2 max-w-3xl text-sm leading-relaxed">{project.description || "No description provided."}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                project.status === 'Active' || project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {project.status || 'Active'}
              </span>
              <Button variant="outline" size="sm" className="text-slate-600">
                <Settings size={14} className="mr-2" /> Settings
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-slate-100 mt-6 bg-slate-50 rounded-lg p-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Client</p>
              <p className="text-sm font-bold text-slate-900">{project.clientName || "None"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Type</p>
              <p className="text-sm font-bold text-slate-900">{project.projectType?.replace('_', ' ') || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Created On</p>
              <p className="text-sm font-bold text-slate-900">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Last Updated</p>
              <p className="text-sm font-bold text-slate-900">{new Date(project.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">Project Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-indigo-200 transition-all group">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Server size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Environments</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Manage test URLs, credentials, and app versions.</p>
          <div className="mt-auto w-full flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">{envCount} Environments</span>
            <Link href={`/developer/projects/${project._id}/environments`}>
              <Button size="sm" className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm">Manage</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-indigo-200 transition-all group">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Test Cases</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Create or import test scenarios and steps.</p>
          <div className="mt-auto w-full flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">Manage</span>
            <Link href={`/developer/projects/${project._id}/test-cases`}>
              <Button size="sm" className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm">Manage</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-indigo-200 transition-all group">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <PlayCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Test Runs</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Assign test cases to testers and track progress.</p>
          <div className="mt-auto w-full flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">Track</span>
            <Link href={`/developer/projects/${project._id}/test-runs`}>
              <Button size="sm" className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm">Manage</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
