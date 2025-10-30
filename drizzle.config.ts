import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables from local.env file
dotenv.config({ path: 'local.env' });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
