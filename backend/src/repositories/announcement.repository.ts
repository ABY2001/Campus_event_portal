import { mockAnnouncements } from "../data/mock/index.js";

export const announcementRepository = {
  findAll() {
    return mockAnnouncements;
  },
};
