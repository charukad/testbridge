"use server";

import dbConnect from "@/lib/mongoose";
import RetestTask from "@/domain/models/RetestTask";
import Issue from "@/domain/models/Issue";
import ActivityLog from "@/domain/models/ActivityLog";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";

export async function submitRetest(formData: FormData) {
  const session = await requireRole("Tester");

  await dbConnect();

  const retestTaskId = formData.get("retestTaskId") as string;
  const result = formData.get("result") as string; // Passed or Failed Again
  const testerNote = formData.get("testerNote") as string;
  const files = formData.getAll("screenshots") as File[];
  
  const retestTask = await RetestTask.findById(retestTaskId);
  if (!retestTask) throw new Error("Retest task not found");
  if (retestTask.assignedTo.toString() !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const issue = await Issue.findById(retestTask.issueId);
  if (!issue) throw new Error("Issue not found");

  // Upload screenshots
  const screenshotUrls: string[] = [];
  for (const file of files) {
    if (file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64}`;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "testbridge_retest_screenshots",
      });
      screenshotUrls.push(uploadResponse.secure_url);
    }
  }

  retestTask.result = result;
  retestTask.status = result === "Passed" ? "Passed" : "Failed Again";
  retestTask.testerNote = testerNote;
  retestTask.screenshots = screenshotUrls;
  await retestTask.save();

  if (result === "Passed") {
    issue.status = "Closed";
    await issue.save();
    
    await ActivityLog.create({
      projectId: issue.projectId,
      userId: session.user.id,
      action: "Closed",
      entityType: "Issue",
      entityId: issue._id,
      message: `Tester passed the retest and closed the issue.`,
    });
  } else {
    issue.status = "Reopened";
    issue.retestCount = (issue.retestCount || 0) + 1;
    await issue.save();

    await ActivityLog.create({
      projectId: issue.projectId,
      userId: session.user.id,
      action: "Reopened",
      entityType: "Issue",
      entityId: issue._id,
      message: `Tester failed the retest. Issue reopened.`,
    });
  }

  revalidatePath("/tester/retesting");
  redirect("/tester/retesting");
}
