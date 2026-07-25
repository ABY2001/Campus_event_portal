import { Router } from "express";

import { selectRole } from "../controllers/index.js";

export const authRouter = Router();

authRouter.post("/select-role", selectRole);
