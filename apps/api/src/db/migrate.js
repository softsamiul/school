import "dotenv/config";
import { runner } from "node-pg-migrate";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be configured before running migrations");
}

await runner({
  databaseUrl: process.env.DATABASE_URL,
  dir: "./migrations",
  migrationsTable: "pgmigrations",
  direction: "up",
  verbose: true,
});
