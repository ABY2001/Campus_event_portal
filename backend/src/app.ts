import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      message: "Campus Event Portal API is running.",
      status: "ok",
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
