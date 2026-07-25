export type UserRole = "STUDENT" | "ADMIN";

export type LoginCredentials = {
  email: string;
  password: string;
  role?: UserRole;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  studentIdNumber?: string;
  department?: string;
  yearOfStudy?: number;
  phoneNumber?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  studentIdNumber?: string;
};
