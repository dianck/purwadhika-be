//npm install --save-dev @types/pg

import { Pool } from "pg"; 
import "dotenv/config"

// Inisialisasi pool dengan environment variable
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
  idleTimeoutMillis: 60000,
});


pool.on("connect", (client) => {
  client
    .query("SET search_path TO test")
    .then(() => console.log("✅ search_path set to 'test'"))
    .catch((err) => console.error("❌ Failed to set search_path", err.stack));
});


// Tangani error pool (opsional tapi direkomendasikan)
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

export default pool;
