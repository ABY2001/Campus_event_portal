import { mockUsers } from "../data/mock/index.js";

export const userRepository = {
  findAll() {
    return mockUsers;
  },
};
