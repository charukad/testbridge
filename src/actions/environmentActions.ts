"use server";

import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import { requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEnvironment(formData: FormData) {
  const session = await requireRole("Developer");

  await dbConnect();

  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const appUrl = formData.get("appUrl") as string;
  const apiBaseUrl = formData.get("apiBaseUrl") as string;
  const username = formData.get("username") as string;
  const encryptedPassword = formData.get("encryptedPassword") as string;
  const browser = formData.get("browser") as string;
  const device = formData.get("device") as string;
  const buildVersion = formData.get("buildVersion") as string;
  const releaseVersion = formData.get("releaseVersion") as string;
  const instructions = formData.get("instructions") as string;

  if (!name || !projectId) {
    throw new Error("Name and Project ID are required");
  }

  await Environment.create({
    projectId,
    name,
    appUrl,
    apiBaseUrl,
    username,
    encryptedPassword,
    browser,
    device,
    buildVersion,
    releaseVersion,
    instructions,
    createdBy: session.user.id,
  });

  revalidatePath(`/developer/projects/${projectId}/environments`);
  redirect(`/developer/projects/${projectId}/environments`);
}
