"use client";

import { useEffect, useState } from "react";
import { Avatar, ProfileFrame } from "@/components/profile/ProfileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormError } from "@/components/ui/FormError";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function ChangePasswordPage() {
  const { user, initAuth } = useAuthStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setDone(false);
    if (next.length < 8) return setError("Your new password must be at least 8 characters.");
    if (next !== confirm) return setError("The new passwords don't match.");
    setSaving(true);
    setError(null);
    try {
      await authApi.changePassword({ current_password: current, new_password: next, confirm_password: confirm });
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn't change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileFrame
      title="Change Password"
      subtitle="Ensure your account is using a strong, unique password"
      maxWidth="max-w-md sm:max-w-xl md:max-w-2xl"
    >
      <div className="rounded-3xl border-0 sm:border sm:border-border/80 bg-white sm:p-8 sm:shadow-xs">
        <div className="flex flex-col items-center text-center pb-6 border-b border-border/60">
          <Avatar src={user?.profile_picture} name={user?.first_name || user?.email || ""} size={84} />
          <h2 className="mt-3 text-base font-bold text-foreground">
            {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.email}
          </h2>
          <p className="text-xs text-muted">Update your login credentials</p>
        </div>

        {/* Security recommendation box */}
        <div className="mt-6 rounded-2xl bg-primary-light/50 border border-primary/20 p-4 text-xs text-zinc-700 leading-relaxed">
          <p className="font-bold text-primary mb-1">Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5 text-muted">
            <li>Minimum of 8 characters</li>
            <li>Use a mix of letters, numbers, and symbols</li>
            <li>Avoid using easily guessable personal info</li>
          </ul>
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4.5">
          <Input
            label="Current Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your current password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <FormError message={error} />
          {done && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              Your password has been changed successfully.
            </p>
          )}

          <div className="mt-4 flex items-center justify-end border-t border-border/60 pt-5">
            <Button
              type="submit"
              isLoading={saving}
              disabled={!current || !next || !confirm}
              className="!w-auto !px-8 text-sm font-bold"
            >
              Update password
            </Button>
          </div>
        </form>
      </div>
    </ProfileFrame>
  );
}
