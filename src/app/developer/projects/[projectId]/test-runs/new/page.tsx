import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import TestCase from "@/domain/models/TestCase";
import User from "@/domain/models/User";
import NewTestRunForm from "./NewTestRunForm";

export default async function NewTestRunPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  await dbConnect();
  
  const environments = await Environment.find({ projectId });
  const testCases = await TestCase.find({ projectId });
  const testers = await User.find({ role: "Tester", isActive: true });

  return (
    <NewTestRunForm 
      projectId={projectId} 
      environments={JSON.parse(JSON.stringify(environments))}
      testCases={JSON.parse(JSON.stringify(testCases))}
      testers={JSON.parse(JSON.stringify(testers))}
    />
  );
}
