import dbConnect from "@/lib/mongoose";
import Environment from "@/domain/models/Environment";
import TestCase from "@/domain/models/TestCase";
import User from "@/domain/models/User";
import NewTestRunForm from "./NewTestRunForm";

export default async function NewTestRunPage({ params }: { params: { projectId: string } }) {
  await dbConnect();
  
  const environments = await Environment.find({ projectId: params.projectId });
  const testCases = await TestCase.find({ projectId: params.projectId });
  const testers = await User.find({ role: "Tester", isActive: true });

  return (
    <NewTestRunForm 
      projectId={params.projectId} 
      environments={JSON.parse(JSON.stringify(environments))}
      testCases={JSON.parse(JSON.stringify(testCases))}
      testers={JSON.parse(JSON.stringify(testers))}
    />
  );
}
