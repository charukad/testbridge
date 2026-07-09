import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import Link from "next/link";
import { Bug, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default async function BugBoardPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // For simplicity, fetch all issues accessible. A real app would filter by project access.
  const issues = await Issue.find()
    .populate('projectId', 'name')
    .sort({ createdAt: -1 });

  const columns = [
    { title: "Open / Reopened", statuses: ["Open", "Reopened"], icon: <AlertCircle className="text-red-500" size={18} /> },
    { title: "In Progress", statuses: ["In Progress"], icon: <Clock className="text-blue-500" size={18} /> },
    { title: "Retest Required / Retesting", statuses: ["Retest Required", "Retesting"], icon: <Bug className="text-yellow-500" size={18} /> },
    { title: "Closed / Fixed", statuses: ["Closed", "Fixed"], icon: <CheckCircle2 className="text-green-500" size={18} /> }
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Bug Board</h1>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full pb-4">
          {columns.map(col => {
            const colIssues = issues.filter(i => col.statuses.includes(i.status as string));
            
            return (
              <div key={col.title} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    {col.icon}
                    {col.title}
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {colIssues.length}
                  </span>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                  {colIssues.map(issue => (
                    <Link href={`/developer/issues/${issue._id}`} key={issue._id.toString()}>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-slate-500">#{issue.issueNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            issue.severity === 'High' ? 'bg-red-100 text-red-700' :
                            issue.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {issue.severity || 'High'}
                          </span>
                        </div>
                        <h4 className="font-medium text-slate-900 text-sm mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                          {issue.title}
                        </h4>
                        <p className="text-xs text-slate-500 mb-3 truncate">Project: {issue.projectId?.name || 'Unknown'}</p>
                        
                        {issue.screenshots && issue.screenshots.length > 0 && (
                          <div className="mt-2 h-20 w-full overflow-hidden rounded-md border border-slate-100 mb-3 relative">
                            <img src={issue.screenshots[0]} alt="Screenshot preview" className="object-cover w-full h-full opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                            <span className="absolute bottom-1 right-1 text-[10px] text-white bg-slate-900/80 px-1.5 rounded">
                              {issue.screenshots.length} img
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-auto pt-2 border-t border-slate-100">
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                          {issue.status === 'Reopened' && (
                            <span className="text-red-500 font-medium">Failed Retest ({issue.retestCount})</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {colIssues.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400">
                      No issues in this column
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
