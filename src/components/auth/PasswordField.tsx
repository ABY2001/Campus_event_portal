import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

type PasswordFieldProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
};

export function PasswordField({
  id = "password-field",
  label = "Password",
  onChange,
  placeholder = "Enter password",
  value = "",
  required = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <HiEyeOff className="h-5 w-5" />
          ) : (
            <HiEye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
