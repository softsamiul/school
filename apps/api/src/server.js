import "dotenv/config";
import { app } from "./app.js";
import { pool } from "./db/client.js";
import { logger } from "./lib/logger.js";

const port = Number(process.env.API_PORT ?? 3001);
const server = app.listen(port, () => {
  logger.info({ port }, "API listening");
});

async function shutdown(signal) {
  logger.info({ signal }, "Shutting down API");
  server.close(async (error) => {
    if (error) logger.error({ err: error }, "HTTP server shutdown failed");
    await pool.end();
    process.exit(error ? 1 : 0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
