import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, LayoutGrid, Calendar } from "lucide-react";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  const userId = (session?.user as any)?.id;

  const projects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your testing projects and clients.</p>
        </div>
        <Link href="/developer/projects/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm">
            <PlusCircle size={16} />
            Create Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No projects yet</h3>
          <p className="text-sm text-slate-500 mb-6">Create your first project to start testing.</p>
          <Link href="/developer/projects/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/developer/projects/${project._id}`} key={project._id.toString()}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer h-full flex flex-col overflow-hidden group">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900 truncate pr-4 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      project.status === 'active' || project.status === 'Active' ? 'bg-green-100 text-green-700' :
                      project.status === 'completed' || project.status === 'Completed' ? 'bg-slate-100 text-slate-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {project.description || "No description provided."}
                  </p>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-xs text-slate-600">
                      <LayoutGrid size={14} className="mr-2 text-slate-400" />
                      <span className="font-medium mr-1">Type:</span> 
                      {project.projectType?.replace('_', ' ') || "Not specified"}
                    </div>
                    {project.clientName && (
                      <div className="flex items-center text-xs text-slate-600">
                        <Folder size={14} className="mr-2 text-slate-400" />
                        <span className="font-medium mr-1">Client:</span> 
                        {project.clientName}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Calendar size={14} className="mr-1.5" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    View Project &rarr;
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
