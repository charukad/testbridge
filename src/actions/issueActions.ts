"use server";

import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import RetestTask from "@/domain/models/RetestTask";
import TestResult from "@/domain/models/TestResult";
import ActivityLog from "@/domain/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateIssueStatus(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const issueId = formData.get("issueId") as string;
  const status = formData.get("status") as string;
  const developerNote = formData.get("developerNote") as string;
  const fixNote = formData.get("fixNote") as string;

  const issue = await Issue.findById(issueId);
  if (!issue) throw new Error("Issue not found");

  issue.status = status;
  if (developerNote) issue.developerNote = developerNote;
  if (fixNote) issue.fixNote = fixNote;
  issue.assignedDeveloper = (session.user as any).id;

  await issue.save();

  await ActivityLog.create({
    projectId: issue.projectId,
    userId: (session.user as any).id,
    action: "Updated",
    entityType: "Issue",
    entityId: issue._id,
    message: `Developer changed issue status to ${status}.`,
  });

  // If fixed, trigger RetestTask
  if (status === "Fixed") {
    issue.status = "Retest Required";
    await issue.save();

    const testResult = await TestResult.findById(issue.testResultId);

    await RetestTask.create({
      projectId: issue.projectId,
      issueId: issue._id,
      testRunId: issue.testRunId,
      testCaseId: issue.testCaseId,
      assignedTo: testResult.testerId, // original tester
      assignedBy: (session.user as any).id,
      status: "Pending",
    });

    await ActivityLog.create({
      projectId: issue.projectId,
      userId: (session.user as any).id,
      action: "Created",
      entityType: "RetestTask",
      entityId: issue._id,
      message: `Developer marked issue as fixed and created a Retest Task for the original tester.`,
    });
  }

  revalidatePath("/developer/issues");
  revalidatePath(`/developer/issues/${issueId}`);
}
