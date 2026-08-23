"use client";

import React, { useId, useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  touched,
  icon,
  iconPosition = "left",
  className = "",
  id,
  type = "text",
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = touched && error;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && iconPosition === "left" && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
        )}
        <input
          id={inputId}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full rounded-input border bg-white px-4 py-3.5 text-sm text-foreground placeholder-zinc-400 outline-none transition-all duration-200 ${
            hasError
              ? "border-red-500 focus:ring-red-500/20"
              : "border-border hover:border-zinc-300 focus:border-primary focus:ring-primary/15"
          } focus:ring-4 ${isPassword || (icon && iconPosition === "right") ? "pr-11" : ""} ${
            icon && iconPosition === "left" ? "pl-11" : ""
          } ${className}`}
          {...props}
        />
        {icon && iconPosition === "right" && !isPassword && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">{icon}</span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye size={20} color="#a1a1aa" variant="Linear" />
            ) : (
              <EyeSlash size={20} color="#a1a1aa" variant="Linear" />
            )}
          </button>
        )}
      </div>
      {hasError && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};
