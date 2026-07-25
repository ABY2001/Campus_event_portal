import { useState } from "react";
import { PiStudentDuotone } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { PasswordField } from "./PasswordField";
import type { LoginCredentials, UserRole } from "@/types/auth";

type LoginFormProps = {
  onLogin?: (credentials: LoginCredentials) => Promise<void> | void;
  onNavigateToSignup?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function LoginForm({
  onLogin,
  onNavigateToSignup,
  isLoading = false,
  errorMessage = null,
}: LoginFormProps) {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      await onLogin?.({ email, password, role });
    } catch (err: any) {
      setLocalError(err.message || "Invalid credentials. Please try again.");
    }
  };

  const handleFillDemoStudent = () => {
    setRole("STUDENT");
    setEmail("student@campus.edu");
    setPassword("Student123!");
    setLocalError(null);
  };

  const handleFillDemoAdmin = () => {
    setRole("ADMIN");
    setEmail("admin@campus.edu");
    setPassword("Admin123!");
    setLocalError(null);
  };

  const displayError = errorMessage || localError;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Select Access Role</label>
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              role === "STUDENT"
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <PiStudentDuotone className="text-lg" />
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
              role === "ADMIN"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <RiAdminFill className="text-lg" />
            Administrator
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {displayError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-700">
          <div className="font-semibold">Authentication Error</div>
          <div className="mt-1">{displayError}</div>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
          placeholder={role === "STUDENT" ? "student@campus.edu" : "admin@campus.edu"}
        />
      </div>

      {/* Password Input */}
      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={setPassword}
        required
        placeholder="Enter your password"
      />

      {/* Quick Demo Credentials Assistant */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick Demo Accounts
          </span>
          <span className="text-xs text-slate-400">One-click auto-fill</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleFillDemoStudent}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            👨‍🎓 Fill Demo Student
          </button>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            🔐 Fill Demo Admin
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          `Sign in as ${role === "STUDENT" ? "Student" : "Admin"}`
        )}
      </button>

      {/* Switch to Signup Link */}
      <p className="text-center text-sm text-slate-500">
        Don't have an account yet?{" "}
        <button
          type="button"
          onClick={onNavigateToSignup}
          className="font-semibold text-slate-950 underline-offset-4 hover:underline"
        >
          Create account
        </button>
      </p>
    </form>
  );
}
