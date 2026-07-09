import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Environment from "@/domain/models/Environment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Server, FileText, PlayCircle, Settings, ArrowLeft } from "lucide-react";
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/developer/projects" className="inline-flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-2 max-w-3xl">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
            {project.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Client</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{project.clientName || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{project.projectType || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Created On</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Last Updated</p>
            <p className="text-sm font-medium text-slate-900 mt-1">{new Date(project.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">Project Modules</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mb-4">
            <Server size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Environments</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Manage test URLs, credentials, and app versions.</p>
          <div className="mt-auto w-full flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">{envCount} Environments</span>
            <Link href={`/developer/projects/${project._id}/environments`}>
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Test Cases</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Create or import test scenarios and steps.</p>
          <div className="mt-auto w-full flex justify-end">
            <Link href={`/developer/projects/${project._id}/test-cases`}>
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg mb-4">
            <PlayCircle size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Test Runs</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Assign test cases to testers and track progress.</p>
          <div className="mt-auto w-full flex justify-end">
            <Link href={`/developer/projects/${project._id}/test-runs`}>
              <Button variant="outline" size="sm">Manage</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
