import { Router } from "express";
import { pool } from "../db/client.js";
import { healthResponseSchema, readyResponseSchema } from "@school/contracts/health";

export const healthRouter = Router();

healthRouter.get("/live", (request, response) => {
  response.json(healthResponseSchema.parse({ status: "ok", service: "api" }));
});

healthRouter.get("/ready", async (request, response, next) => {
  try {
    await pool.query("select 1");
    response.json(
      readyResponseSchema.parse({ status: "ok", service: "api", checks: { database: "ok" } }),
    );
  } catch (error) {
    request.log.warn({ err: error }, "Readiness check failed");
    response.status(503).json({
      status: "error",
      service: "api",
      checks: { database: "unavailable" },
    });
  }
});
