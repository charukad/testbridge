import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./src/domain/models/User";
import Project from "./src/domain/models/Project";
import Environment from "./src/domain/models/Environment";
import TestCase from "./src/domain/models/TestCase";
import TestRun from "./src/domain/models/TestRun";

dotenv.config({ path: ".env.local" });

async function seedDemoTestRun() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const developer = await User.findOne({ role: "Developer" });
  const tester = await User.findOne({ role: "Tester" });

  if (!developer || !tester) {
    console.error("No Developer or Tester users found. Run seedUsers.ts first.");
    process.exit(1);
  }

  console.log(`Developer: ${developer.name} (${developer.email})`);
  console.log(`Tester: ${tester.name} (${tester.email})`);

  const project = await Project.findOne({ name: "Bakery POS" });
  if (!project) {
    console.error("No Bakery POS project found. Run seedTestCases.ts first.");
    process.exit(1);
  }

  // Create or find environment
  let env = await Environment.findOne({ projectId: project._id });
  if (!env) {
    env = await Environment.create({
      projectId: project._id,
      name: "Local Dev Environment",
      appUrl: "http://localhost:5173",
      apiBaseUrl: "http://localhost:3001/api",
      username: "owner@demo-bakery.local",
      encryptedPassword: "Admin@12345",
      browser: "Chrome",
      device: "Desktop",
      buildVersion: "1.0.0",
      releaseVersion: "1.0.0",
      instructions: "Use the seeded demo data. Login as owner to test admin features, as cashier to test POS.",
      createdBy: developer._id,
    });
    console.log("Created demo environment:", env.name);
  } else {
    console.log("Found existing environment:", env.name);
  }

  // Pick 12 test cases from authentication & smoke test sections
  const testCases = await TestCase.find({ projectId: project._id }).limit(12);

  if (testCases.length === 0) {
    console.error("No test cases found. Run seedTestCases.ts first.");
    process.exit(1);
  }

  // Remove old demo test run if exists
  await TestRun.deleteOne({ name: "Bakery POS — Sprint 1 Smoke Test" });

  const testRun = await TestRun.create({
    projectId: project._id,
    environmentId: env._id,
    name: "Bakery POS — Sprint 1 Smoke Test",
    description: "Initial smoke and authentication testing for the Bakery POS platform.",
    assignedBy: developer._id,
    assignedTo: tester._id,
    testCaseIds: testCases.map((tc: any) => tc._id),
    status: "Pending",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    instructions: "Please focus on authentication flows and basic navigation. Mark any issues you find with Critical severity.",
  });

  console.log(`\n✅ Demo test run created successfully!`);
  console.log(`   Name: ${testRun.name}`);
  console.log(`   Test Cases: ${testCases.length}`);
  console.log(`   Assigned To: ${tester.name} (${tester.email})`);
  console.log(`   Deadline: ${testRun.deadline!.toLocaleDateString()}`);
  console.log(`\nLogin as tester to see this run in the dashboard!`);

  process.exit(0);
}

seedDemoTestRun().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
