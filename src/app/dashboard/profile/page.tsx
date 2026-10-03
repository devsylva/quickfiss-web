"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Profile, Lock, Notification, ShieldSecurity, LogoutCurve, CloseCircle } from "iconsax-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FileUploadBox } from "@/components/ui/FileUploadBox";
import { FormError } from "@/components/ui/FormError";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";

const MAX_PICTURE_BYTES = 4 * 1024 * 1024;

interface RowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  comingSoon?: boolean;
}

function SettingsRow({ icon, title, description, onClick, comingSoon }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={comingSoon}
      className="flex items-center gap-3.5 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/50 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-white"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      {comingSoon && (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-muted">Coming soon</span>
      )}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, clearAuth, initAuth } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // The cookie copy of the user can be stale (or missing), so always refresh it from the API.
  useEffect(() => {
    let cancelled = false;
    async function loadAccount() {
      try {
        const me = await authApi.getMe();
        if (!cancelled) useAuthStore.getState().setUser(me);
      } catch (err: unknown) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 401
            ? "Your session has expired. Please sign in again."
            : "We couldn't refresh your account details."
        );
      }
    }
    loadAccount();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Continue clearing local state regardless of server logout response
    } finally {
      clearAuth();
      router.push("/sign-in");
    }
  };

  const openEdit = () => {
    setFirstName(user?.first_name ?? "");
    setLastName(user?.last_name ?? "");
    setPhone(user?.phone_number ?? "");
    setPicture(null);
    setUploadKey((k) => k + 1);
    setEditError(null);
    setEditOpen(true);
  };

  const handlePictureSelect = (file: File | null) => {
    setEditError(null);
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setPicture(null);
      setUploadKey((k) => k + 1);
      setEditError("Please choose a JPG or PNG image.");
      return;
    }
    if (file && file.size > MAX_PICTURE_BYTES) {
      setPicture(null);
      setUploadKey((k) => k + 1);
      setEditError("That image is larger than 4MB. Please choose a smaller one.");
      return;
    }
    setPicture(file);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!firstName.trim() || !lastName.trim()) {
      setEditError("Please enter your first and last name.");
      return;
    }
    setIsSaving(true);
    setEditError(null);
    try {
      const updated = await authApi.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim(),
        profile_picture: picture,
      });
      setUser({ ...(user ?? updated), ...updated });
      setEditOpen(false);
      setNotice("Your profile has been updated.");
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "We couldn't save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordOpen(true);
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPassword) return;
    if (newPassword.length < 8) {
      setPasswordError("Your new password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords don't match.");
      return;
    }
    setIsChangingPassword(true);
    setPasswordError(null);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordOpen(false);
      setNotice("Your password has been changed.");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "We couldn't change your password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayName = fullName || user?.email?.split("@")[0] || "Your account";
  const displayEmail = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase() || "Q";
  const hasClient = user?.is_client ?? user?.user_type === "client";
  const hasArtisan = user?.is_artisan ?? user?.user_type === "artisan";
  const providerLabel: Record<string, string> = {
    approved: "Service provider",
    pending: "Provider · in review",
    rejected: "Provider · needs changes",
    draft: "Provider · setup unfinished",
  };
  const accountTypes = [
    ...(hasClient ? ["Customer"] : []),
    ...(hasArtisan ? [providerLabel[user?.provider_status ?? "draft"] ?? "Service provider"] : []),
  ];

  return (
    <DashboardShell>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-5xl">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Account Profile</h1>
        <p className="mt-1 text-sm text-muted">Manage your personal information and preferences.</p>

        {notice && (
          <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
              <CloseCircle size={16} color="currentColor" variant="Linear" />
            </button>
          </div>
        )}
        <FormError message={loadError} signIn={loadError?.includes("sign in")} />

        {/* User Card */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border/80 bg-zinc-50/60 p-6 sm:flex-row sm:gap-6">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-light text-2xl font-extrabold text-primary shadow-xs">
            {user?.profile_picture ? (
              <Image src={user.profile_picture} alt="" fill className="object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
            <p className="text-xs text-muted">{displayEmail}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user?.is_verified ? "Verified Account" : "Account Active"}
              </span>
              {accountTypes.map((label) => (
                <span key={label} className="rounded-full bg-primary-light px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Grid on Desktop */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SettingsRow
            icon={<Profile size={20} color="#3d5afe" variant="Bold" />}
            title="Personal Information"
            description="Name, phone number and profile photo"
            onClick={openEdit}
          />
          <SettingsRow
            icon={<Lock size={20} color="#3d5afe" variant="Bold" />}
            title="Security & Password"
            description="Change your password"
            onClick={openPassword}
          />
          <SettingsRow
            icon={<Notification size={20} color="#3d5afe" variant="Bold" />}
            title="Notifications"
            description="Email, SMS, and booking status alerts"
            comingSoon
          />
          <SettingsRow
            icon={<ShieldSecurity size={20} color="#3d5afe" variant="Bold" />}
            title="Trust & Verification"
            description="Government ID and verification status"
            comingSoon
          />
        </div>

        {/* Logout Button */}
        <div className="mt-8 border-t border-border pt-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <LogoutCurve size={18} color="#dc2626" variant="Linear" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      <Modal open={editOpen}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Personal information</h2>
          <button type="button" onClick={() => setEditOpen(false)} aria-label="Close" className="text-zinc-400 hover:text-foreground">
            <CloseCircle size={20} color="currentColor" variant="Linear" />
          </button>
        </div>
        <form onSubmit={saveProfile} className="mt-4 flex flex-col gap-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={30} />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={30} />
          </div>
          <Input
            label="Phone number"
            type="tel"
            placeholder="+2348012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Profile photo</p>
            <FileUploadBox key={uploadKey} helperText="JPG or PNG, max 4MB." onFileSelect={handlePictureSelect} />
          </div>
          <FormError message={editError} />
          <div className="mt-2 flex flex-col gap-2">
            <Button type="submit" isLoading={isSaving}>
              Save changes
            </Button>
            <Button type="button" variant="secondary" disabled={isSaving} onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={passwordOpen}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Change password</h2>
          <button type="button" onClick={() => setPasswordOpen(false)} aria-label="Close" className="text-zinc-400 hover:text-foreground">
            <CloseCircle size={20} color="currentColor" variant="Linear" />
          </button>
        </div>
        <form onSubmit={submitPassword} className="mt-4 flex flex-col gap-4 text-left">
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <FormError message={passwordError} />
          <div className="mt-2 flex flex-col gap-2">
            <Button type="submit" isLoading={isChangingPassword} disabled={!currentPassword || !newPassword || !confirmPassword}>
              Update password
            </Button>
            <Button type="button" variant="secondary" disabled={isChangingPassword} onClick={() => setPasswordOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
