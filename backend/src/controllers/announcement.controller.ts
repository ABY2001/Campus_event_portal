import type { Request, Response } from "express";

import { announcementService } from "../services/announcement.service.js";

export function getAnnouncements(_request: Request, response: Response) {
  response.status(200).json(announcementService.getAll());
}
