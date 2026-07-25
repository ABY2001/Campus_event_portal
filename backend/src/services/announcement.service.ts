import { announcementRepository } from "../repositories/index.js";

export const announcementService = {
  getAll() {
    return announcementRepository.findAll();
  },
};
