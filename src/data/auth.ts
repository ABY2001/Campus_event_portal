import type { AuthUser, LoginCredentials, SignupPayload } from "@/types/auth";

export const demoLoginCredentials: LoginCredentials = {
  email: "aby@example.com",
  password: "Password@123",
};

export const demoSignupPayload: SignupPayload = {
  name: "Aby Ponnachan",
  email: "aby@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

export const currentUser: AuthUser = {
  id: "student-1",
  name: "Aby Ponnachan",
  email: "aby@example.com",
  role: "student",
};

export const adminUser: AuthUser = {
  id: "admin-1",
  name: "Campus Admin",
  email: "admin@campus.edu",
  role: "admin",
};
