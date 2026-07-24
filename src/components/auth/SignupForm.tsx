import { useState } from "react";

import type { SignupPayload } from "@/types/auth";

type SignupFormProps = {
  defaultValues?: Partial<SignupPayload>;
  onBackToLogin?: () => void;
  onSignup?: (values: SignupPayload) => void;
};

export function SignupForm({
  defaultValues,
  onBackToLogin,
  onSignup,
}: SignupFormProps) {
  const [values, setValues] = useState<SignupPayload>({
    name: defaultValues?.name ?? "",
    email: defaultValues?.email ?? "",
    password: defaultValues?.password ?? "",
    confirmPassword: defaultValues?.confirmPassword ?? "",
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSignup?.(values);
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="Aby Ponnachan"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="student@campus.edu"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="signup-password"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={values.password}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Create password"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="confirm-password"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={values.confirmPassword}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Repeat password"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
        By continuing, students can browse events, manage registrations, and
        receive campus announcements from a single dashboard.
      </div>

      <button
        className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Create account
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          className="font-medium text-slate-900 underline-offset-4 hover:underline"
          type="button"
          onClick={onBackToLogin}
        >
          Back to login
        </button>
      </p>
    </form>
  );
}
