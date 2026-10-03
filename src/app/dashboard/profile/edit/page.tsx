"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "iconsax-react";
import { Avatar, ProfileFrame } from "@/components/profile/ProfileFrame";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormError } from "@/components/ui/FormError";
import { authApi } from "@/lib/api/auth";
import { COUNTRIES, NIGERIAN_STATES } from "@/lib/places";
import { useAuthStore } from "@/store/useAuthStore";

const MAX_PICTURE_BYTES = 4 * 1024 * 1024;

export default function EditProfilePage() {
  const { user, setUser, initAuth } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Always start from the server's copy of the account; the cookie copy can be stale.
  useEffect(() => {
    let cancelled = false;
    authApi
      .getMe()
      .then((me) => {
        if (cancelled) return;
        useAuthStore.getState().setUser(me);
        setName([me.first_name, me.last_name].filter(Boolean).join(" "));
        setPhone(me.phone_number ?? "");
        setDob(me.date_of_birth ?? "");
        setCountry(me.country ?? "");
        setState(me.state ?? "");
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your details. Please refresh.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Birthday is only asked of providers (it's part of their ID check).
  const isProvider = user?.is_artisan ?? user?.user_type === "artisan";

  const pickPicture = (file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return setError("Please choose a JPG or PNG image.");
    if (file.size > MAX_PICTURE_BYTES) return setError("That image is larger than 4MB.");
    setError(null);
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const [first, ...rest] = name.trim().split(/\s+/);
    if (!first) return setError("Please enter your name.");
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await authApi.updateProfile({
        first_name: first,
        ...(rest.length ? { last_name: rest.join(" ") } : {}),
        phone_number: phone.trim(),
        country,
        state,
        ...(isProvider && dob ? { date_of_birth: dob } : {}),
        profile_picture: picture,
      });
      setUser({ ...(user ?? updated), ...updated });
      setPicture(null);
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileFrame
      title="Edit Profile"
      subtitle="Keep your personal information and contact details up to date"
      maxWidth="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
    >
      <div className="rounded-3xl border-0 sm:border sm:border-border/80 bg-white sm:p-8 sm:shadow-xs">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6 pb-6 border-b border-border/60">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            aria-label="Change profile photo"
            className="group relative cursor-pointer"
          >
            <Avatar src={preview ?? user?.profile_picture} name={name || user?.email || ""} size={96} />
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-xs transition-transform group-hover:scale-110">
              <Camera size={15} color="#ffffff" variant="Bold" />
            </span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => pickPicture(e.target.files?.[0] ?? null)}
          />

          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-sm font-bold text-foreground">Profile Picture</h3>
            <p className="mt-0.5 text-xs text-muted">Supports JPG or PNG. Maximum file size 4MB.</p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInput.current?.click()}
                className="!w-auto !py-1.5 !px-3.5 text-xs font-semibold"
              >
                Upload Photo
              </Button>
              {preview && (
                <button
                  type="button"
                  onClick={() => {
                    setPicture(null);
                    setPreview(null);
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <Input
              label="Full Name"
              value={name}
              maxLength={61}
              autoComplete="name"
              placeholder="e.g. Samuel Okafor"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+2348012345678"
              value={phone}
              autoComplete="tel"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {isProvider && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDob(e.target.value)}
              />
              <div className="hidden sm:block" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <Select
              label="Country/Region"
              placeholder="Select country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setState("");
              }}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            />
            {country === "Nigeria" || country === "" ? (
              <Select
                label="State"
                placeholder="Select state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
              />
            ) : (
              <Input
                label="State/Region"
                value={state}
                maxLength={60}
                placeholder="State or Province"
                onChange={(e) => setState(e.target.value)}
              />
            )}
          </div>

          <FormError message={error} />
          {saved && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              Your profile has been updated successfully.
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-border/60 pt-5">
            <Button
              type="submit"
              isLoading={saving}
              disabled={!ready}
              className="!w-auto !px-8 text-sm font-bold"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </ProfileFrame>
  );
}
