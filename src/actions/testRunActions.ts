"use server";

import dbConnect from "@/lib/mongoose";
import TestRun from "@/domain/models/TestRun";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTestRun(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const environmentId = formData.get("environmentId") as string;
  const assignedTo = formData.get("assignedTo") as string;
  const testCaseIdsJson = formData.get("testCaseIds") as string;
  const deadline = formData.get("deadline") as string;
  const instructions = formData.get("instructions") as string;

  if (!name || !projectId || !environmentId || !assignedTo || !testCaseIdsJson) {
    throw new Error("Missing required fields");
  }

  let testCaseIds = [];
  try {
    testCaseIds = JSON.parse(testCaseIdsJson);
  } catch (e) {
    throw new Error("Invalid test cases data");
  }

  await TestRun.create({
    projectId,
    name,
    description,
    environmentId,
    assignedBy: (session.user as any).id,
    assignedTo,
    testCaseIds,
    status: "Pending",
    deadline: deadline ? new Date(deadline) : undefined,
    instructions,
  });

  revalidatePath(`/developer/projects/${projectId}/test-runs`);
  redirect(`/developer/projects/${projectId}/test-runs`);
}
