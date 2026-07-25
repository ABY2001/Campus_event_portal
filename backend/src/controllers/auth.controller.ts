import type { Request, Response } from "express";

export function selectRole(_request: Request, response: Response) {
  response.status(200).json({
    message: "Auth is disabled for now. Role-based demo entry only.",
  });
}
