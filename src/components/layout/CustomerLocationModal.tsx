"use client";

import { useState } from "react";
import { Location } from "iconsax-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { onboardingApi } from "@/lib/api/onboarding";

/** Lets a customer set where they are, so providers can show how far away they are. */
export function CustomerLocationModal({
  open,
  initialAddress,
  onClose,
  onSaved,
}: {
  open: boolean;
  initialAddress: string;
  onClose: () => void;
  onSaved: (address: string) => void;
}) {
  const [address, setAddress] = useState(initialAddress);
  const [coords, setCoords] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCurrent = () => {
    if (!navigator.geolocation) return setError("Your browser can't share its location. Type your address instead.");
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords(`${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("We couldn't get your location. Type your address instead.");
      },
      { timeout: 8000 },
    );
  };

  const save = async () => {
    if (!address.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onboardingApi.saveClientProfile({ address: address.trim(), ...(coords ? { location: coords } : {}) });
      onSaved(address.trim());
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We couldn't save your location.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} position="bottom">
      <h2 className="text-lg font-bold text-foreground">Your location</h2>
      <p className="mt-1 text-xs text-muted">We use this to show providers near you.</p>
      <div className="mt-4 flex flex-col gap-3 text-left">
        <Input
          label="Address"
          placeholder="Street, area, city"
          value={address}
          maxLength={200}
          onChange={(e) => setAddress(e.target.value)}
          icon={<Location size={18} color="#3d5afe" variant="Bold" />}
        />
        <button type="button" onClick={useCurrent} disabled={locating} className="text-left text-xs font-semibold text-primary hover:underline">
          {locating ? "Finding you..." : coords ? "Location captured ✓" : "Use my current location"}
        </button>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <Button isLoading={saving} disabled={!address.trim()} onClick={save}>Save location</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}
