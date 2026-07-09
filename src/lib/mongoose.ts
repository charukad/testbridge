import mongoose from "mongoose";

import "@/domain/models/ActivityLog";
import "@/domain/models/Comment";
import "@/domain/models/Environment";
import "@/domain/models/Issue";
import "@/domain/models/Project";
import "@/domain/models/RetestTask";
import "@/domain/models/TestCase";
import "@/domain/models/TestResult";
import "@/domain/models/TestRun";
import "@/domain/models/UploadedFile";
import "@/domain/models/User";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
