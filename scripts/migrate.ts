import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const dbMigration = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration successful");
  } catch (err) {
    console.error("Error during migration: ", err);
    process.exit(1);
  }
};

dbMigration();
