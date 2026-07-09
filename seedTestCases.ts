import mongoose from "mongoose";
import fs from "fs";
import * as dotenv from "dotenv";
import User from "./src/domain/models/User";
import Project from "./src/domain/models/Project";
import TestCase from "./src/domain/models/TestCase";

dotenv.config({ path: ".env.local" });

async function seedTestCases() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const developer = await User.findOne({ role: "Developer" });
  if (!developer) {
    console.error("No developer user found");
    process.exit(1);
  }

  let project = await Project.findOne({ name: "Bakery POS" });
  if (!project) {
    project = await Project.create({
      name: "Bakery POS",
      description: "Full system testing for Bakery POS platform",
      createdBy: developer._id,
      status: "Active"
    });
    console.log("Created Project: Bakery POS");
  } else {
    console.log("Found existing Project: Bakery POS");
  }

  // Clear existing test cases for this project to avoid duplicates on re-run
  await TestCase.deleteMany({ projectId: project._id });
  console.log("Cleared existing test cases for Bakery POS");

  const mdContent = fs.readFileSync("bakery_pos_full_system_test_cases.md", "utf-8");
  const lines = mdContent.split("\n");

  let currentModule = "General";
  let count = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      // Extract module name, e.g. "## 4. Smoke And Environment Tests" -> "Smoke And Environment Tests"
      currentModule = line.replace(/##\s*\d+\.\s*/, "").trim();
      continue;
    }

    if (line.trim().startsWith("|") && !line.includes("---")) {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length >= 5) {
        const id = parts[1];
        const area = parts[2];
        const steps = parts[3];
        const expected = parts[4];

        // Skip headers
        if (id === "ID" || id === "Field" || id === "Data") continue;
        if (!id || !expected) continue; // some tables might not be test cases

        // Special handling for the commands table which has 3 columns: ID | Command | Expected Result
        if (parts.length === 5 && currentModule.includes("Required Verification Commands")) {
           await TestCase.create({
              projectId: project._id,
              testCaseId: parts[1],
              module: currentModule,
              title: "Verification Command",
              steps: parts[2], // Command
              expectedResult: parts[3], // Expected Result
              status: "Active",
              createdBy: developer._id,
            });
            count++;
            continue;
        }

        if (parts.length >= 6) {
            await TestCase.create({
              projectId: project._id,
              testCaseId: id,
              module: currentModule,
              title: area,
              steps: steps,
              expectedResult: expected,
              status: "Active",
              createdBy: developer._id,
            });
            count++;
        }
      }
    }
  }

  console.log(`Successfully seeded ${count} test cases.`);
  process.exit(0);
}

seedTestCases().catch(console.error);
