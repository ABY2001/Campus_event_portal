import { AuthLayout, SignupForm } from "@/components/auth";
import type { SignupPayload } from "@/types/auth";

type SignupPageProps = {
  defaultValues?: Partial<SignupPayload>;
  onBackToLogin?: () => void;
  onSignup?: (values: SignupPayload) => void;
};

export function SignupPage(props: SignupPageProps) {
  return (
    <AuthLayout
      title="Create your account"
      description="Join the campus event portal to explore and register for upcoming events."
    >
      <SignupForm
        defaultValues={props.defaultValues}
        onBackToLogin={props.onBackToLogin}
        onSignup={props.onSignup}
      />
    </AuthLayout>
  );
}
