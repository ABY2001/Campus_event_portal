import type { Request, Response } from "express";

import { eventService } from "../services/event.service.js";

export function getEvents(_request: Request, response: Response) {
  response.status(200).json(eventService.getAll());
}
