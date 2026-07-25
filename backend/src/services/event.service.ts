import { eventRepository } from "../repositories/index.js";

export const eventService = {
  getAll() {
    return eventRepository.findAll();
  },
};
