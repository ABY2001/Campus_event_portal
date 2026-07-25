import { userRepository } from "../repositories/index.js";

export const userService = {
  getAll() {
    return userRepository.findAll();
  },
};
