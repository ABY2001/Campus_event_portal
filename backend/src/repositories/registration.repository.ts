import { mockRegistrations } from "../data/mock/index.js";

export const registrationRepository = {
  findAll() {
    return mockRegistrations;
  },
};
