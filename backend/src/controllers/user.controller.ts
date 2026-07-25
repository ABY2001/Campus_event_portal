import type { Request, Response } from "express";

import { userService } from "../services/user.service.js";

export function getUsers(_request: Request, response: Response) {
  response.status(200).json(userService.getAll());
}
