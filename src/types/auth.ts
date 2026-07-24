export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
};
