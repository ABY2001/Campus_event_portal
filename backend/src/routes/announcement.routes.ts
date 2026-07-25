import { Router } from "express";

import { getAnnouncements } from "../controllers/index.js";

export const announcementRouter = Router();

announcementRouter.get("/", getAnnouncements);
