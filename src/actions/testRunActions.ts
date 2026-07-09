"use server";

import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import TestResult from "@/domain/models/TestResult";
import ActivityLog from "@/domain/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createTestRun(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const name = formData.get("name") as string;
  const deadline = formData.get("deadline") as string;
  const environmentId = formData.get("environmentId") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const description = formData.get("description") as string;
  const instructions = formData.get("instructions") as string;
  const projectId = formData.get("projectId") as string;
  const testCaseIdsStr = formData.get("testCaseIds") as string;

  const testCaseIds = JSON.parse(testCaseIdsStr);

  const testRun = await TestRun.create({
    name,
    projectId,
    environmentId,
    testCaseIds,
    assignedTo,
    assignedBy: (session.user as any).id,
    description,
    instructions,
    deadline: deadline ? new Date(deadline) : undefined,
    status: "Pending",
  });

  await ActivityLog.create({
    projectId,
    userId: (session.user as any).id,
    action: "Created",
    entityType: "TestRun",
    entityId: testRun._id,
    message: `Developer created test run "${name}" and assigned to tester.`,
  });

  revalidatePath(`/developer/projects/${projectId}/test-runs`);
  redirect(`/developer/projects/${projectId}/test-runs`);
}

export async function submitTestRun(testRunId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Tester") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const run = await TestRun.findOne({
    _id: testRunId,
    assignedTo: (session.user as any).id,
  });

  if (!run) {
    throw new Error("Test run not found or not assigned to you.");
  }

  // If all cases have results, mark Completed; otherwise Submitted
  const resultCount = await TestResult.countDocuments({ testRunId });
  const allDone = resultCount >= run.testCaseIds.length;

  run.status = allDone ? "Completed" : "Submitted";
  await run.save();

  await ActivityLog.create({
    projectId: run.projectId,
    userId: (session.user as any).id,
    action: allDone ? "Completed" : "Submitted",
    entityType: "TestRun",
    entityId: run._id,
    message: `Tester submitted test run "${run.name}". Status: ${run.status}.`,
  });

  revalidatePath("/tester/tasks");
  redirect("/tester/tasks");
}
