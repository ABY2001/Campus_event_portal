import { Router } from "express";

import { getEvents } from "../controllers/index.js";

export const eventRouter = Router();

eventRouter.get("/", getEvents);
