import { Router } from "express";

import { getAdminOverview } from "../controllers/index.js";

export const adminRouter = Router();

adminRouter.get("/overview", getAdminOverview);
