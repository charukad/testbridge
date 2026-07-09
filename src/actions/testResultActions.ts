"use server";

import dbConnect from "@/lib/mongoose";
import TestResult from "@/domain/models/TestResult";
import TestCase from "@/domain/models/TestCase";
import Issue from "@/domain/models/Issue";
import TestRun from "@/domain/models/TestRun";
import ActivityLog from "@/domain/models/ActivityLog";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

type TestResultStatus = "Pass" | "Fail" | "Blocked" | "Not Tested";

export async function submitTestResult(formData: FormData) {
  const session = await requireRole("Tester");

  await dbConnect();

  const testRunId = formData.get("testRunId") as string;
  const projectId = formData.get("projectId") as string;
  const testCaseId = formData.get("testCaseId") as string;
  const result = formData.get("result") as TestResultStatus;
  const actualResult = formData.get("actualResult") as string;
  const note = formData.get("note") as string;
  const severity = formData.get("severity") as string || "High";
  const files = formData.getAll("screenshots") as File[];

  const testRun = await TestRun.findOne({
    _id: testRunId,
    testCaseIds: testCaseId,
  });

  if (!testRun) {
    throw new Error("Test run or test case not found.");
  }

  if (testRun.status === "Completed") {
    throw new Error("This test run is already completed.");
  }

  // A saved result claims the case for that tester. Other testers can see it, but cannot overwrite it.
  let testResult = await TestResult.findOne({ testRunId, testCaseId });

  if (testResult && testResult.testerId.toString() !== session.user.id) {
    throw new Error("This test case has already been taken by another tester.");
  }
  
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

  if (testResult) {
    testResult.result = result;
    testResult.actualResult = actualResult;
    testResult.note = note;
    testResult.screenshots = [...(testResult.screenshots || []), ...screenshotUrls];
    if (result === "Fail") testResult.severity = severity;
    await testResult.save();
  } else {
    // Save new Test Result
    try {
      testResult = await TestResult.create({
        testRunId,
        projectId,
        testCaseId,
        testerId: session.user.id,
        result,
        actualResult,
        note,
        severity: result === "Fail" ? severity : undefined,
        screenshots: screenshotUrls,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new Error("This test case has already been taken by another tester.");
      }

      throw error;
    }
  }

  // Update TestRun status if it's pending
  if (testRun && testRun.status === "Pending") {
    testRun.status = "In Progress";
    await testRun.save();
  }

  // Automatic Bug Workflow
  if (result === "Fail" && !testResult.issueId) {
    const testCase = await TestCase.findById(testCaseId);
    if (!testCase) {
      throw new Error("Test case not found");
    }

    const existingIssue = await Issue.findOne({ testRunId, testCaseId });
    if (existingIssue) {
      testResult.issueId = existingIssue._id;
      await testResult.save();
      revalidatePath(`/tester/test-runs/${testRunId}`);
      return;
    }
    
    // Get highest issue number to increment
    const lastIssue = await Issue.findOne({ projectId }).sort({ issueNumber: -1 });
    const issueNumber = lastIssue ? lastIssue.issueNumber + 1 : 1;

    const issue = await Issue.create({
      projectId,
      testRunId,
      testCaseId,
      testResultId: testResult._id,
      issueNumber,
      title: `${testCase.testCaseId} - ${testCase.title}`,
      description: note || "No description provided.",
      expectedResult: testCase.expectedResult,
      actualResult: actualResult || "Not provided.",
      screenshots: testResult.screenshots,
      severity,
      status: "Open",
      reportedBy: session.user.id,
    });

    testResult.issueId = issue._id;
    await testResult.save();

    await ActivityLog.create({
      projectId,
      userId: session.user.id,
      action: "Created",
      entityType: "Issue",
      entityId: issue._id,
      message: `Tester reported a failed test case and created Issue #${issueNumber}.`,
    });
  }

  revalidatePath(`/tester/test-runs/${testRunId}`);
}
