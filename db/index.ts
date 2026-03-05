import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as userSchema from "./user";
import * as workspaceSchema from "./workspace";
import * as pageSchema from "./page";

// Load environment variables if not already loaded by Next.js
import * as dotenv from "dotenv";
dotenv.config();

// Combine all schemas into a single object for Drizzle's relational queries
const schema = {
    ...userSchema,
    ...workspaceSchema,
    ...pageSchema,
};

// Create a connection pool to PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create and export the Drizzle database instance
export const db = drizzle(pool, { schema });
