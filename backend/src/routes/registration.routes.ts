import { Router } from "express";

import { getRegistrations } from "../controllers/index.js";

export const registrationRouter = Router();

registrationRouter.get("/", getRegistrations);
