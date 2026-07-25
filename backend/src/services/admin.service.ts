import { adminRepository } from "../repositories/index.js";

export const adminService = {
  getOverview() {
    return adminRepository.getOverview();
  },
};
