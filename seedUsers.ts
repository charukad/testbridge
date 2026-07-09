import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/domain/models/User";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const hashedPassword = await bcrypt.hash("password123", 10);
  await User.updateMany({}, { password: hashedPassword });
  console.log("All passwords have been reset to 'password123'");
  process.exit(0);
}

seed().catch(console.error);
