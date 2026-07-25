import { useState } from "react";
import { PiStudentDuotone } from "react-icons/pi";
import { PasswordField } from "./PasswordField";
import type { SignupPayload } from "@/types/auth";

type SignupFormProps = {
  onSignup?: (payload: SignupPayload) => Promise<void> | void;
  onNavigateToLogin?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function SignupForm({
  onSignup,
  onNavigateToLogin,
  isLoading = false,
  errorMessage = null,
}: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student specific profile fields
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please verify both password fields.");
      return;
    }

    const payload: SignupPayload = {
      name,
      email,
      password,
      confirmPassword,
      role: "STUDENT",
      studentIdNumber,
      department,
      yearOfStudy: Number(yearOfStudy),
      phoneNumber,
    };

    try {
      await onSignup?.(payload);
    } catch (err: any) {
      setLocalError(err.message || "Registration failed. Please try again.");
    }
  };

  const displayError = errorMessage || localError;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Student Account Badge */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <PiStudentDuotone className="text-xl" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Student Account Registration</h4>
          <p className="text-xs text-slate-500">
            Admins must log in directly via the{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-slate-900 underline"
            >
              Login Page
            </button>.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {displayError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-700">
          <div className="font-semibold">Registration Notice</div>
          <div className="mt-1">{displayError}</div>
        </div>
      )}

      {/* Full Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="signup-name">
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
          placeholder="e.g. Aby Ponnachan"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">
          Student Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
          placeholder="student@campus.edu"
        />
      </div>

      {/* Student Specific Profile Fields */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Academic Details
        </span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700" htmlFor="student-id">
              Student ID Number
            </label>
            <input
              id="student-id"
              type="text"
              value={studentIdNumber}
              onChange={(e) => setStudentIdNumber(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400"
              placeholder="e.g. STU-2026-088"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700" htmlFor="department">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Arts & Humanities">Arts & Humanities</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700" htmlFor="year-study">
              Year of Study
            </label>
            <select
              id="year-study"
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value={1}>1st Year (Freshman)</option>
              <option value={2}>2nd Year (Sophomore)</option>
              <option value={3}>3rd Year (Junior)</option>
              <option value={4}>4th Year (Senior)</option>
              <option value={5}>Postgraduate / Masters</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700" htmlFor="phone-number">
              Phone Number (Optional)
            </label>
            <input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-slate-400"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Password Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          required
          placeholder="Min. 6 characters"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          placeholder="Repeat password"
        />
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
            Creating Student Account...
          </span>
        ) : (
          "Register Student Account"
        )}
      </button>

      {/* Switch to Login Link */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="font-semibold text-slate-950 underline-offset-4 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
