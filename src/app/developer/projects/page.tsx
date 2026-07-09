import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder } from "lucide-react";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  const userId = (session?.user as any)?.id;

  const projects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <Link href="/developer/projects/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <PlusCircle size={16} />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
          <p className="mt-1 text-slate-500">Get started by creating a new testing project.</p>
          <Link href="/developer/projects/new" className="mt-6 inline-block">
            <Button className="bg-violet-600 hover:bg-violet-700">Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/developer/projects/${project._id}`} key={project._id.toString()}>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 truncate pr-4">{project.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex-1 line-clamp-3 mb-4">
                  {project.description || "No description provided."}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                  <span>Client: {project.clientName || "N/A"}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
