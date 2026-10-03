import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ArtisanStatusProps {
  status: "loading" | "not-found" | "error";
  error?: string | null;
  onRetry?: () => void;
}

/** Full-screen placeholder for a provider that is loading, missing, or failed to load. */
export const ArtisanStatus: React.FC<ArtisanStatusProps> = ({ status, error, onRetry }) => (
  <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-white px-6 text-center">
    {status === "loading" ? (
      <>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted">Loading provider...</p>
      </>
    ) : (
      <>
        <h1 className="text-xl font-extrabold text-foreground">
          {status === "not-found" ? "Provider not found" : "Something went wrong"}
        </h1>
        <p className="max-w-sm text-sm text-muted">
          {status === "not-found"
            ? "This provider doesn't exist or is no longer available."
            : error ?? "We couldn't load this provider. Please try again."}
        </p>
        <div className="flex gap-3">
          {status === "error" && onRetry && (
            <Button type="button" onClick={onRetry} className="!w-auto !px-6">
              Try again
            </Button>
          )}
          <Link href="/dashboard">
            <Button type="button" variant="secondary" className="!w-auto !px-6">
              Back to home
            </Button>
          </Link>
        </div>
      </>
    )}
  </div>
);
