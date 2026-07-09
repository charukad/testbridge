"use server";

import dbConnect from "@/lib/mongoose";
import TestCase from "@/domain/models/TestCase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTestCase(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const projectId = formData.get("projectId") as string;
  
  await TestCase.create({
    projectId,
    testCaseId: formData.get("testCaseId"),
    module: formData.get("module"),
    title: formData.get("title"),
    description: formData.get("description"),
    preconditions: formData.get("preconditions"),
    steps: formData.get("steps"),
    expectedResult: formData.get("expectedResult"),
    priority: formData.get("priority"),
    type: formData.get("type"),
    createdBy: (session.user as any).id,
  });

  revalidatePath(`/developer/projects/${projectId}/test-cases`);
  redirect(`/developer/projects/${projectId}/test-cases`);
}

export async function importTestCases(projectId: string, testCases: any[]) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const formattedDocs = testCases.map(tc => ({
    projectId,
    testCaseId: tc["Test Case ID"] || tc.testCaseId,
    module: tc["Module"] || tc.module,
    title: tc["Title"] || tc.title,
    description: tc["Description"] || tc.description,
    preconditions: tc["Preconditions"] || tc.preconditions,
    steps: tc["Test Steps"] || tc.steps,
    expectedResult: tc["Expected Result"] || tc.expectedResult,
    priority: tc["Priority"] || tc.priority,
    type: tc["Type"] || tc.type,
    createdBy: (session.user as any).id,
  }));

  await TestCase.insertMany(formattedDocs);

  revalidatePath(`/developer/projects/${projectId}/test-cases`);
  return { success: true, count: formattedDocs.length };
}
