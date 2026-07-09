import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import Environment from "@/domain/models/Environment";
import TestCase from "@/domain/models/TestCase";
import TestRun from "@/domain/models/TestRun";
import Issue from "@/domain/models/Issue";
import Link from "next/link";
import { Server, FileText, PlayCircle, ArrowLeft, Bug, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  await dbConnect();

  const project = await Project.findById(params.projectId);
  if (!project) redirect("/developer/projects");

  const [envCount, testCaseCount, testRunCount, openIssueCount, recentRuns] = await Promise.all([
    Environment.countDocuments({ projectId: project._id }),
    TestCase.countDocuments({ projectId: project._id }),
    TestRun.countDocuments({ projectId: project._id }),
    Issue.countDocuments({ projectId: project._id, status: { $in: ["Open", "In Progress", "Reopened"] } }),
    TestRun.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name")
      .populate("environmentId", "name"),
  ]);

  const statusColors: Record<string, string> = {
    Pending: "bg-slate-100 text-slate-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <Link href="/developer/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1.5" /> Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-2xl">{project.description || "No description provided."}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 ${project.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
            {project.status || "Active"}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
          {[
            { label: "Client", value: project.clientName || "—" },
            { label: "Type", value: project.projectType?.replace("_", " ") || "—" },
            { label: "Created", value: new Date(project.createdAt).toLocaleDateString() },
            { label: "Updated", value: new Date(project.updatedAt).toLocaleDateString() },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{f.label}</p>
              <p className="text-sm font-bold text-slate-900">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Environments", value: envCount, icon: <Server size={18} />, color: "indigo", href: `/developer/projects/${project._id}/environments` },
          { label: "Test Cases", value: testCaseCount, icon: <FileText size={18} />, color: "blue", href: `/developer/projects/${project._id}/test-cases` },
          { label: "Test Runs", value: testRunCount, icon: <PlayCircle size={18} />, color: "green", href: `/developer/projects/${project._id}/test-runs` },
          { label: "Open Issues", value: openIssueCount, icon: <Bug size={18} />, color: "red", href: `/developer/issues` },
        ].map((s) => (
          <Link href={s.href} key={s.label}>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
              <div className={`w-9 h-9 bg-${s.color}-50 text-${s.color}-600 rounded-lg flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Project Modules */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Project Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Environments", desc: "Manage test URLs, credentials, and build details.", href: `/developer/projects/${project._id}/environments`, icon: <Server size={24} />, color: "indigo", count: `${envCount} configured` },
            { title: "Test Cases", desc: "Create or import test scenarios, steps, and expected results.", href: `/developer/projects/${project._id}/test-cases`, icon: <FileText size={24} />, color: "blue", count: `${testCaseCount} cases` },
            { title: "Test Runs", desc: "Assign test cases to testers and monitor progress.", href: `/developer/projects/${project._id}/test-runs`, icon: <PlayCircle size={24} />, color: "green", count: `${testRunCount} runs` },
          ].map((m) => (
            <div key={m.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md hover:border-indigo-200 transition-all group">
              <div className={`p-3 bg-${m.color}-50 text-${m.color}-600 rounded-lg mb-4 w-fit group-hover:bg-${m.color}-600 group-hover:text-white transition-colors`}>
                {m.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4 flex-1">{m.desc}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">{m.count}</span>
                <Link href={m.href}>
                  <button className="bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm">
                    Manage →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Test Runs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent Test Runs</h2>
          <Link href={`/developer/projects/${project._id}/test-runs/new`}>
            <button className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors">
              <PlusCircle size={14} /> New Run
            </button>
          </Link>
        </div>
        {recentRuns.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No test runs yet. Create one above!</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Run Name</th>
                <th className="px-6 py-3 text-left font-bold">Environment</th>
                <th className="px-6 py-3 text-left font-bold">Assigned To</th>
                <th className="px-6 py-3 text-left font-bold">Cases</th>
                <th className="px-6 py-3 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recentRuns as any[]).map((run) => (
                <tr key={run._id.toString()} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{run.name}</td>
                  <td className="px-6 py-4 text-slate-600">{run.environmentId?.name || "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{run.assignedTo?.name || "—"}</td>
                  <td className="px-6 py-4 text-slate-600">{run.testCaseIds?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[run.status] || "bg-slate-100 text-slate-600"}`}>
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
