import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import Link from "next/link";
import { Bug, AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";

export default async function BugBoardPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // For simplicity, fetch all issues accessible. A real app would filter by project access.
  const issues = await Issue.find()
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const columns = [
    { title: "Open / Reopened", statuses: ["Open", "Reopened"], icon: <AlertCircle className="text-red-500" size={18} /> },
    { title: "In Progress", statuses: ["In Progress"], icon: <Clock className="text-blue-500" size={18} /> },
    { title: "Retest Required", statuses: ["Retest Required", "Retesting"], icon: <Bug className="text-yellow-500" size={18} /> },
    { title: "Closed / Fixed", statuses: ["Closed", "Fixed"], icon: <CheckCircle2 className="text-green-500" size={18} /> }
  ];

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issue Board</h1>
          <p className="text-sm text-slate-500 mt-1">Track bugs automatically reported by testers and manage their lifecycle.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(col => {
            const colIssues = issues.filter(i => col.statuses.includes(i.status as string));
            
            return (
              <div key={col.title} className="w-80 flex flex-col bg-slate-50 rounded-xl border border-slate-200 shadow-sm max-h-full">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl sticky top-0 z-10">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    {col.icon}
                    {col.title}
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold shadow-inner">
                    {colIssues.length}
                  </span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {colIssues.map(issue => (
                    <Link href={`/developer/issues/${issue._id}`} key={issue._id.toString()}>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2.5">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{issue.issueNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            issue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                            issue.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {issue.severity || 'High'}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-slate-900 text-sm mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
                          {issue.title}
                        </h4>
                        
                        <div className="text-xs text-slate-500 mb-3 truncate flex items-center">
                          <span className="font-medium mr-1 text-slate-600">Project:</span> {issue.projectId?.name || 'Unknown'}
                        </div>
                        
                        {issue.screenshots && issue.screenshots.length > 0 && (
                          <div className="mt-2 h-24 w-full overflow-hidden rounded-md border border-slate-200 mb-3 relative group/img">
                            <img src={issue.screenshots[0]} alt="Screenshot" className="object-cover w-full h-full opacity-90 group-hover/img:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <span className="absolute bottom-2 right-2 text-xs font-semibold text-white bg-slate-900/60 px-2 py-0.5 rounded shadow-sm backdrop-blur-sm">
                              {issue.screenshots.length} {issue.screenshots.length === 1 ? 'image' : 'images'}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
                          <span className="font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
                          {issue.status === 'Reopened' ? (
                            <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">Failed Retest ({issue.retestCount})</span>
                          ) : (
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {colIssues.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 mt-2 bg-white/50">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-medium">No issues here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
