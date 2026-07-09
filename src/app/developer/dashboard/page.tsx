import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import { FolderGit2, Activity, Bug, CheckCircle } from "lucide-react";

export default async function DeveloperDashboard() {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const userId = (session?.user as any)?.id;

  // Aggregate some simple metrics
  const projectCount = await Project.countDocuments({ createdBy: userId });
  const activeTestRuns = await TestRun.countDocuments({ assignedBy: userId, status: "In Progress" });
  const openIssues = await Issue.countDocuments({ reportedBy: { $exists: true }, status: { $in: ["Open", "In Progress", "Reopened"] } }); // Basic filter for now

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Developer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/20 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-100 transition-colors">
            <FolderGit2 size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Projects</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{projectCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/20 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Test Runs</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{activeTestRuns}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-red-500/20 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
            <Bug size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Open Issues</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{openIssues}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center space-x-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/20 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Runs</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="text-slate-500 text-sm py-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
          No recent activity found. Create a project to get started!
        </div>
      </div>
    </div>
  );
}
