import type { Request, Response } from "express";

import { registrationService } from "../services/registration.service.js";

export function getRegistrations(_request: Request, response: Response) {
  response.status(200).json(registrationService.getAll());
}
