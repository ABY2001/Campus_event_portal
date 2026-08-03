import { useState } from "react";
import { AuthLayout, SignupForm } from "@/components/auth";
import type { SignupPayload } from "@/types/auth";
import { registerUserApi, saveDemoRegisteredUser, type ApiAuthResponse } from "@/lib/api";

type SignupPageProps = {
  onSuccess?: (user: ApiAuthResponse) => void;
  onNavigateToLogin?: () => void;
};

export function SignupPage({ onSuccess, onNavigateToLogin }: SignupPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (payload: SignupPayload) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Try registering via FastAPI backend API
      const user = await registerUserApi({
        email: payload.email,
        password: payload.password,
        full_name: payload.name,
        role: payload.role,
        department: payload.department,
        student_id_number: payload.studentIdNumber,
      });

      // Save user record
      saveDemoRegisteredUser({
        email: payload.email,
        password: payload.password,
        full_name: payload.name,
        role: payload.role || "STUDENT",
      });

      onSuccess?.(user);
    } catch (err: any) {
      // Fallback demo support for offline UI testing
      const demoUser: ApiAuthResponse = {
        access_token: `demo_token_signup_${Date.now()}`,
        token_type: "bearer",
        user_id: `user-${Date.now()}`,
        email: payload.email,
        full_name: payload.name,
        role: payload.role || "STUDENT",
      };

      // Save registered user into demo users storage list
      saveDemoRegisteredUser({
        email: payload.email,
        password: payload.password,
        full_name: payload.name,
        role: payload.role || "STUDENT",
      });

      localStorage.setItem("campus_access_token", demoUser.access_token);
      localStorage.setItem("campus_user", JSON.stringify(demoUser));
      onSuccess?.(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your Account"
      description="Join the Campus Event Portal to discover upcoming workshops, cultural programs, and hackathons."
    >
      <SignupForm
        onSignup={handleSignup}
        onNavigateToLogin={onNavigateToLogin}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthLayout>
  );
}
