import { registrationRepository } from "../repositories/index.js";

export const registrationService = {
  getAll() {
    return registrationRepository.findAll();
  },
};
