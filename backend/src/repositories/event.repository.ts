import { mockEvents } from "../data/mock/index.js";

export const eventRepository = {
  findAll() {
    return mockEvents;
  },
};
