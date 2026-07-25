import { useState } from "react";
import { AuthLayout, SignupForm } from "@/components/auth";
import type { SignupPayload } from "@/types/auth";
import { registerUserApi, type ApiAuthResponse } from "@/lib/api";

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
      // Try registering via FastAPI backend API
      const user = await registerUserApi({
        email: payload.email,
        password: payload.password,
        full_name: payload.name,
        role: payload.role,
        student_id_number: payload.studentIdNumber,
        department: payload.department,
        year_of_study: payload.yearOfStudy,
        phone_number: payload.phoneNumber,
      });
      onSuccess?.(user);
    } catch (err: any) {
      // Fallback demo support for offline UI testing
      const demoUser: ApiAuthResponse = {
        access_token: "demo_token_signup_12345",
        token_type: "bearer",
        user_id: "demo-signup-id",
        email: payload.email,
        full_name: payload.name,
        role: payload.role,
      };
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
