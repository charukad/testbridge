import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function dropAllCollections() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to DB");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  const collections = await db.listCollections().toArray();

  if (collections.length === 0) {
    console.log("Database is already empty.");
  } else {
    for (const col of collections) {
      await db.dropCollection(col.name);
      console.log(`  🗑️  Dropped collection: ${col.name}`);
    }
    console.log(`\n✅ All ${collections.length} collections dropped. Database is now empty.`);
  }

  process.exit(0);
}

dropAllCollections().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
