"use server";

import dbConnect from "@/lib/mongoose";
import Project from "@/domain/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "Developer") {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const clientName = formData.get("clientName") as string;
  const projectType = formData.get("projectType") as string;

  if (!name) {
    throw new Error("Project name is required");
  }

  const project = await Project.create({
    name,
    description,
    clientName,
    projectType,
    createdBy: (session.user as any).id,
  });

  revalidatePath("/developer/projects");
  redirect(`/developer/projects/${project._id}`);
}
