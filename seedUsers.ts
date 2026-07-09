import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/domain/models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Auth checks 'passwordHash' field — must use correct field name
  const result = await User.updateMany({}, { passwordHash: hashedPassword });
  console.log(`Updated ${result.modifiedCount} users`);
  console.log("All passwords have been reset to 'password123'");

  const users = await User.find({}, "name email role");
  users.forEach((u: any) => console.log(`  ✅ ${u.role} | ${u.name} | ${u.email}`));

  process.exit(0);
}

seed().catch(console.error);
