import type { AuthUser, LoginCredentials, SignupPayload } from "@/types/auth";

export const demoLoginCredentials: LoginCredentials = {
  email: "student@campus.edu",
  password: "Student123!",
  role: "STUDENT",
};

export const demoSignupPayload: SignupPayload = {
  name: "Campus Student",
  email: "student@campus.edu",
  password: "Student123!",
  confirmPassword: "Student123!",
  role: "STUDENT",
  studentIdNumber: "STU-2026-001",
  department: "Computer Science",
  yearOfStudy: 3,
};

export const currentUser: AuthUser = {
  id: "student-1",
  name: "Campus Student",
  email: "student@campus.edu",
  role: "STUDENT",
};

export const adminUser: AuthUser = {
  id: "admin-1",
  name: "Campus Admin",
  email: "admin@campus.edu",
  role: "ADMIN",
};
