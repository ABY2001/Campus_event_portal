export type UserModel = {
  department?: string;
  email: string;
  id: string;
  name: string;
  role: "admin" | "student";
  year?: string;
};
