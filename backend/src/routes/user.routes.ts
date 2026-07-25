import { Router } from "express";

import { getUsers } from "../controllers/index.js";

export const userRouter = Router();

userRouter.get("/", getUsers);
