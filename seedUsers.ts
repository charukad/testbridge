import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/domain/models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Delete any existing users first to avoid duplicates
  await User.deleteMany({});

  const users = await User.insertMany([
    {
      name: "Dasun",
      email: "dasun@gmail.com",
      passwordHash: hashedPassword,
      role: "Developer",
      isActive: true,
    },
    {
      name: "Ashan",
      email: "ashan@gmail.com",
      passwordHash: hashedPassword,
      role: "Tester",
      isActive: true,
    },
  ]);

  console.log(`Created ${users.length} users:`);
  users.forEach((u: any) => console.log(`  ✅ ${u.role} | ${u.name} | ${u.email} | password: password123`));

  process.exit(0);
}

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
