import { Router } from "express";

import { adminRouter } from "./admin.routes.js";
import { announcementRouter } from "./announcement.routes.js";
import { authRouter } from "./auth.routes.js";
import { eventRouter } from "./event.routes.js";
import { registrationRouter } from "./registration.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/announcements", announcementRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/registrations", registrationRouter);
apiRouter.use("/users", userRouter);
