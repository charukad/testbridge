import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import TestCase from "@/domain/models/TestCase";
import TestRun from "@/domain/models/TestRun";
import User from "@/domain/models/User";
import NewTestRunForm from "./NewTestRunForm";

const ACTIVE_TEST_RUN_STATUSES = ["Pending", "In Progress", "Submitted"];

export default async function NewTestRunPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  await dbConnect();
  
  const [environments, testCases, testers, activeRuns] = await Promise.all([
    Environment.find({ projectId }),
    TestCase.find({ projectId }),
    User.find({ role: "Tester", isActive: true }),
    TestRun.find({ projectId, status: { $in: ACTIVE_TEST_RUN_STATUSES } })
      .populate("assignedTo", "name email")
      .select("name status assignedTo testCaseIds"),
  ]);

  const activeAssignmentsByCase = activeRuns.reduce<Record<string, {
    runName: string;
    status: string;
    testerName: string;
  }>>((acc, run) => {
    const tester = run.assignedTo as { name?: string; email?: string } | undefined;
    run.testCaseIds.forEach((testCaseId: unknown) => {
      acc[testCaseId?.toString() || ""] = {
        runName: run.name,
        status: run.status,
        testerName: tester?.name || tester?.email || "Unknown tester",
      };
    });
    return acc;
  }, {});
  delete activeAssignmentsByCase[""];

  return (
    <NewTestRunForm 
      projectId={projectId} 
      environments={JSON.parse(JSON.stringify(environments))}
      testCases={JSON.parse(JSON.stringify(testCases))}
      testers={JSON.parse(JSON.stringify(testers))}
      activeAssignmentsByCase={activeAssignmentsByCase}
    />
  );
}
