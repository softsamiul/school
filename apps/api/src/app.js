import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(request) {
        return { id: request.id, method: request.method, url: request.url.split("?")[0] };
      },
    },
  }),
);

app.use("/api/health", healthRouter);

app.use((request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  request.log.error({ err: error }, "Unhandled request error");
  response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
  });
});
