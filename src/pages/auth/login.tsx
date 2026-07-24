import { AuthLayout, LoginForm } from "@/components/auth";

type LoginPageProps = {
  onSelectAdmin?: () => void;
  onSelectStudent?: () => void;
};

export function LoginPage(props: LoginPageProps) {
  return (
    <AuthLayout
      title="Choose your portal access"
      description="No authentication is required right now. Pick a role to open the matching dashboard instantly."
    >
      <LoginForm
        onSelectAdmin={props.onSelectAdmin}
        onSelectStudent={props.onSelectStudent}
      />
    </AuthLayout>
  );
}
