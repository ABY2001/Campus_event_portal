import type { Request, Response } from "express";

import { adminService } from "../services/admin.service.js";

export function getAdminOverview(_request: Request, response: Response) {
  response.status(200).json(adminService.getOverview());
}
