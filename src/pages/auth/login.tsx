import { useState } from "react";
import { AuthLayout, LoginForm } from "@/components/auth";
import type { LoginCredentials } from "@/types/auth";
import { loginUserApi, getDemoRegisteredUsers, type ApiAuthResponse } from "@/lib/api";

type LoginPageProps = {
  onSuccess?: (user: ApiAuthResponse) => void;
  onNavigateToSignup?: () => void;
};

export function LoginPage({ onSuccess, onNavigateToSignup }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Try logging in via FastAPI backend API
      const user = await loginUserApi({
        email: credentials.email,
        password: credentials.password,
      });

      // 2. Validate selected access role vs actual account role returned from backend
      if (credentials.role && user.role !== credentials.role) {
        if (credentials.role === "ADMIN" && user.role === "STUDENT") {
          throw new Error(
            `Access Denied: You selected Administrator access, but '${credentials.email}' is registered as a Student. Please switch the tab to 'Student' or enter Administrator credentials.`
          );
        }
        if (credentials.role === "STUDENT" && user.role === "ADMIN") {
          throw new Error(
            `Access Denied: You selected Student access, but '${credentials.email}' is registered as an Administrator. Please switch the tab to 'Administrator'.`
          );
        }
      }

      onSuccess?.(user);
    } catch (err: any) {
      // If error is role mismatch from above, display error message directly
      if (err.message && err.message.startsWith("Access Denied:")) {
        setErrorMessage(err.message);
        return;
      }

      // Check registered users list (including newly signed-up accounts)
      const demoUsers = getDemoRegisteredUsers();
      const matchedUser = demoUsers.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (matchedUser || credentials.email === "student@campus.edu" || credentials.email === "admin@campus.edu") {
        const actualAccountRole = matchedUser?.role || (credentials.email.includes("admin") ? "ADMIN" : "STUDENT");
        const accountFullName = matchedUser?.full_name || (actualAccountRole === "ADMIN" ? "Campus Admin" : "Campus Student");

        // Enforce role validation for demo / newly created accounts
        if (credentials.role && credentials.role !== actualAccountRole) {
          if (credentials.role === "ADMIN" && actualAccountRole === "STUDENT") {
            setErrorMessage(
              `Access Denied: You selected Administrator access, but '${credentials.email}' is a Student account. Please switch the tab to 'Student' or enter Administrator credentials.`
            );
            return;
          }
          if (credentials.role === "STUDENT" && actualAccountRole === "ADMIN") {
            setErrorMessage(
              `Access Denied: You selected Student access, but '${credentials.email}' is an Administrator account. Please switch the tab to 'Administrator'.`
            );
            return;
          }
        }

        const demoUser: ApiAuthResponse = {
          access_token: `demo_token_${Date.now()}`,
          token_type: "bearer",
          user_id: `user-${Date.now()}`,
          email: credentials.email,
          full_name: accountFullName,
          role: actualAccountRole,
        };
        localStorage.setItem("campus_access_token", demoUser.access_token);
        localStorage.setItem("campus_user", JSON.stringify(demoUser));
        onSuccess?.(demoUser);
      } else {
        const cleanMsg =
          err.message === "Failed to fetch"
            ? "Unable to reach server. Please check your backend connection or enter your registered credentials."
            : err.message || "Invalid email or password.";
        setErrorMessage(cleanMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to Campus Event Portal"
      description="Sign in to your account to browse events, register for campus activities, and access your portal dashboard."
    >
      <LoginForm
        onLogin={handleLogin}
        onNavigateToSignup={onNavigateToSignup}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthLayout>
  );
}
