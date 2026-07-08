
#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

// Load environment variables
require("dotenv").config();

async function main() {
  console.log("🚀 Starting Supabase setup...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing required environment variables. Please check .env file.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), "supabase", "migrations", "001-initial-schema.sql");
    const migrationSql = await fs.readFile(migrationPath, "utf8");

    console.log("📄 Applying database migrations...");
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSql });

    if (error) {
      console.error("❌ Error applying migrations:", error);
    } else {
      console.log("✅ Database migrations applied successfully!");
    }

    console.log("\n🎉 Supabase setup complete!");
  } catch (err) {
    console.error("❌ Setup failed:", err);
    process.exit(1);
  }
}

main();
