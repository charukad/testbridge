"use server";

import dbConnect from "@/lib/mongoose";
import Issue from "@/domain/models/Issue";
import RetestTask from "@/domain/models/RetestTask";
import TestResult from "@/domain/models/TestResult";
import ActivityLog from "@/domain/models/ActivityLog";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateIssueStatus(formData: FormData) {
  const session = await requireRole("Developer");

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
  issue.assignedDeveloper = session.user.id;

  await issue.save();

  await ActivityLog.create({
    projectId: issue.projectId,
    userId: session.user.id,
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
    if (!testResult) {
      throw new Error("Original test result not found");
    }

    const existingOpenTask = await RetestTask.findOne({
      issueId: issue._id,
      status: { $in: ["Pending", "In Progress"] },
    });

    if (!existingOpenTask) {
      await RetestTask.create({
        projectId: issue.projectId,
        issueId: issue._id,
        testRunId: issue.testRunId,
        testCaseId: issue.testCaseId,
        assignedTo: testResult.testerId,
        assignedBy: session.user.id,
        status: "Pending",
      });
    }

    await ActivityLog.create({
      projectId: issue.projectId,
      userId: session.user.id,
      action: "Created",
      entityType: "RetestTask",
      entityId: issue._id,
      message: `Developer marked issue as fixed and created a Retest Task for the original tester.`,
    });
  }

  revalidatePath("/developer/issues");
  revalidatePath(`/developer/issues/${issueId}`);
}
