"use server";

import dbConnect from "@/lib/mongoose";
import TestResult from "@/domain/models/TestResult";
import TestCase from "@/domain/models/TestCase";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import ActivityLog from "@/domain/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";

export async function submitTestResult(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Tester") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const testRunId = formData.get("testRunId") as string;
  const projectId = formData.get("projectId") as string;
  const testCaseId = formData.get("testCaseId") as string;
  const result = formData.get("result") as string;
  const actualResult = formData.get("actualResult") as string;
  const note = formData.get("note") as string;
  const files = formData.getAll("screenshots") as File[];
  
  // Upload screenshots to Cloudinary
  const screenshotUrls: string[] = [];
  for (const file of files) {
    if (file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64}`;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "testbridge_screenshots",
      });
      screenshotUrls.push(uploadResponse.secure_url);
    }
  }

  // Save Test Result
  const testResult = await TestResult.create({
    testRunId,
    projectId,
    testCaseId,
    testerId: (session.user as any).id,
    result,
    actualResult,
    note,
    screenshots: screenshotUrls,
  });

  // Update TestRun status if it's pending
  await TestRun.findByIdAndUpdate(testRunId, { status: "In Progress" });

  // Automatic Bug Workflow
  if (result === "Fail") {
    const testCase = await TestCase.findById(testCaseId);
    
    // Get highest issue number to increment
    const lastIssue = await Issue.findOne({ projectId }).sort({ issueNumber: -1 });
    const issueNumber = lastIssue ? lastIssue.issueNumber + 1 : 1;

    const issue = await Issue.create({
      projectId,
      testRunId,
      testCaseId,
      testResultId: testResult._id,
      issueNumber,
      title: `Failed: ${testCase.title}`,
      description: note || "No description provided.",
      expectedResult: testCase.expectedResult,
      actualResult: actualResult || "Not provided.",
      screenshots: screenshotUrls,
      severity: "High", // Default, can be changed by dev
      status: "Open",
      reportedBy: (session.user as any).id,
    });

    testResult.issueId = issue._id;
    await testResult.save();

    await ActivityLog.create({
      projectId,
      userId: (session.user as any).id,
      action: "Created",
      entityType: "Issue",
      entityId: issue._id,
      message: `Tester reported a failed test case and created Issue #${issueNumber}.`,
    });
  }

  revalidatePath(`/tester/test-runs/${testRunId}`);
  redirect(`/tester/test-runs/${testRunId}`);
}
