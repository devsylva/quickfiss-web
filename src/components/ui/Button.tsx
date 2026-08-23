import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "oauth" | "link" | "light" | "secondary";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  ...props
}) => {
  const baseStyle =
    "flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.99] disabled:pointer-events-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

  const variants = {
    primary:
      "w-full rounded-btn bg-primary py-4 text-sm text-white shadow-lg shadow-primary/20 hover:bg-primary-dark gap-2 disabled:bg-zinc-300 disabled:shadow-none",
    outline: "w-full rounded-btn border border-border bg-white py-3.5 text-sm text-foreground hover:bg-zinc-50 gap-2",
    oauth: "w-full rounded-btn border border-border bg-white py-3.5 text-sm text-foreground hover:bg-zinc-50 gap-2",
    link: "bg-transparent text-sm text-primary hover:text-primary-dark gap-1.5",
    light: "w-full rounded-btn bg-white py-4 text-sm text-primary hover:bg-zinc-50 gap-2",
    secondary: "w-full rounded-btn bg-primary-light py-4 text-sm text-primary hover:bg-primary-light/70 gap-2",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};
