import Link from "next/link";

interface FormErrorProps {
  message: string | null;
  /** Show a "Sign in" link, for expired or missing sessions. */
  signIn?: boolean;
}

export const FormError: React.FC<FormErrorProps> = ({ message, signIn }) => {
  if (!message) return null;
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
      {message}{" "}
      {signIn && (
        <Link href="/sign-in" className="font-semibold underline">
          Sign in
        </Link>
      )}
    </div>
  );
};
