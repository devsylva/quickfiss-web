"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft2, CloseCircle, Location } from "iconsax-react";

interface ProviderLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLocation: (address: string, coords?: { latitude: number; longitude: number }) => void;
  initialAddress?: string;
  avatarUrl?: string;
}

export function ProviderLocationModal({
  isOpen,
  onClose,
  onSaveLocation,
  initialAddress = "",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
}: ProviderLocationModalProps) {
  const [showEnableDialog, setShowEnableDialog] = useState(true);
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>(undefined);

  if (!isOpen) return null;

  const handleEnableLocation = () => {
    setIsLocating(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // There's no reverse-geocoding service wired up, so the street address is still typed in;
          // the coordinates are what let customers see how far away a provider is.
          setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setIsLocating(false);
          setShowEnableDialog(false);
        },
        () => {
          setIsLocating(false);
          setShowEnableDialog(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setShowEnableDialog(false);
    }
  };

  const handleCancelEnable = () => {
    setShowEnableDialog(false);
  };

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!address.trim()) return;
    onSaveLocation(address.trim(), coords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in">
      {/* Top Header Bar */}
      <div className="relative z-10 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur-md sm:h-16 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-zinc-100"
        >
          <ArrowLeft2 size={20} color="#18181b" variant="Linear" />
        </button>
        <h1 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
          Your Location
        </h1>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 overflow-hidden bg-[#f4f5f8]">
        {/* Realistic Stylized Vector Map of Ikeja */}
        <svg
          className="absolute inset-0 h-full w-full object-cover select-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Map background fill */}
          <rect width="1000" height="1000" fill="#f8f9fa" />

          {/* Urban blocks & light land parcels */}
          <path d="M 0,0 L 400,0 L 360,280 L 0,220 Z" fill="#f1f3f4" />
          <path d="M 450,0 L 1000,0 L 1000,320 L 520,290 Z" fill="#f3f4f6" />
          <path d="M 0,280 L 320,330 L 260,650 L 0,580 Z" fill="#f0f2f5" />
          <path d="M 380,360 L 720,330 L 800,680 L 360,710 Z" fill="#f3f4f6" />
          <path d="M 760,260 L 1000,240 L 1000,650 L 830,620 Z" fill="#f1f3f4" />
          <path d="M 0,640 L 300,720 L 240,1000 L 0,1000 Z" fill="#f0f2f5" />
          <path d="M 340,750 L 800,720 L 820,1000 L 320,1000 Z" fill="#f4f5f7" />
          <path d="M 850,660 L 1000,640 L 1000,1000 L 860,1000 Z" fill="#f1f3f4" />

          {/* Minor local residential streets */}
          <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="80" y1="60" x2="340" y2="120" />
            <line x1="120" y1="140" x2="320" y2="180" />
            <line x1="160" y1="20" x2="140" y2="240" />
            <line x1="260" y1="40" x2="230" y2="260" />

            <line x1="520" y1="80" x2="780" y2="40" />
            <line x1="560" y1="140" x2="900" y2="100" />
            <line x1="680" y1="20" x2="650" y2="260" />
            <line x1="820" y1="40" x2="790" y2="280" />

            <line x1="80" y1="360" x2="280" y2="400" />
            <line x1="60" y1="440" x2="260" y2="480" />
            <line x1="180" y1="310" x2="150" y2="580" />

            <line x1="420" y1="420" x2="680" y2="390" />
            <line x1="440" y1="520" x2="760" y2="480" />
            <line x1="410" y1="620" x2="740" y2="580" />
            <line x1="520" y1="350" x2="480" y2="680" />
            <line x1="640" y1="340" x2="610" y2="670" />

            <line x1="420" y1="820" x2="780" y2="780" />
            <line x1="390" y1="910" x2="750" y2="870" />
            <line x1="540" y1="730" x2="520" y2="980" />
            <line x1="680" y1="720" x2="660" y2="990" />
          </g>

          {/* Primary Avenue Lines (Major Arterials) */}
          <g stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
            {/* Obafemi Awolowo Way */}
            <path d="M 120,0 L 420,290 L 520,380 L 860,690 L 1000,820" />
            {/* Allen Avenue */}
            <path d="M 380,0 L 430,300 L 460,540 L 490,1000" />
            {/* Opebi Road */}
            <path d="M 460,540 L 580,410 L 760,260 L 1000,80" />
            {/* Mobolaji Bank Anthony */}
            <path d="M 0,380 L 360,420 L 700,460 L 1000,520" />
          </g>

          {/* Road Fill (slightly warmer gray) */}
          <g stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 120,0 L 420,290 L 520,380 L 860,690 L 1000,820" />
            <path d="M 380,0 L 430,300 L 460,540 L 490,1000" />
            <path d="M 460,540 L 580,410 L 760,260 L 1000,80" />
            <path d="M 0,380 L 360,420 L 700,460 L 1000,520" />
          </g>

          {/* Road Text Annotations (Matching Screenshot 1 & 2) */}
          <g fill="#9ca3af" fontSize="15" fontWeight="600" fontFamily="sans-serif">
            {/* Ikeja label */}
            <text x="20" y="320" fontSize="32" fontWeight="800" fill="#4b5563">
              Ikeja
            </text>

            {/* OREGUN label */}
            <text x="640" y="240" fontSize="18" fontWeight="700" fill="#9ca3af" letterSpacing="2">
              OREGUN
            </text>

            {/* Obafemi Awolowo angled */}
            <text
              x="230"
              y="120"
              transform="rotate(40 230 120)"
              fontSize="14"
              fill="#6b7280"
              fontWeight="600"
            >
              Obafemi Awo...
            </text>

            {/* Allen Ave angled */}
            <text
              x="390"
              y="220"
              transform="rotate(75 390 220)"
              fontSize="14"
              fill="#6b7280"
              fontWeight="600"
            >
              Allen Ave
            </text>

            {/* Opebi Rd angled */}
            <text
              x="540"
              y="440"
              transform="rotate(45 540 440)"
              fontSize="14"
              fill="#6b7280"
              fontWeight="600"
            >
              Opebi Rd
            </text>

            {/* State University Teaching Hospital */}
            <text x="0" y="380" fontSize="13" fill="#9ca3af" fontWeight="500">
              State University
            </text>
            <text x="0" y="400" fontSize="13" fill="#9ca3af" fontWeight="500">
              Teaching Hospital
            </text>
          </g>

          {/* Pulsing ring under the marker */}
          <circle cx="535" cy="320" r="28" fill="#3d5afe" opacity="0.15" />
          <circle cx="535" cy="320" r="16" fill="#3d5afe" opacity="0.25" />
        </svg>

        {/* Custom Location Marker Pin with Provider Avatar (Matching Screenshot 2) */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-full transition-transform hover:scale-105"
          style={{ left: "53.5%", top: "32%" }}
        >
          {/* Teardrop Marker SVG */}
          <div className="relative flex flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary p-1 shadow-xl ring-4 ring-primary/20">
              {/* Avatar circle inside */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                <Image
                  src={avatarUrl}
                  alt="Provider Location"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Pointy tip */}
            <div className="-mt-1.5 h-3.5 w-3.5 rotate-45 rounded-xs bg-primary shadow-sm" />
          </div>
        </div>

        {/* DIALOG 1: "Enable Location" Dialog (Matching Screenshot 1) */}
        {showEnableDialog && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
              {/* Circular Location Icon */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-light">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                  <Location size={24} color="#ffffff" variant="Bold" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-5 text-xl font-extrabold text-primary">Enable Location</h2>

              {/* Subtitle */}
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Enabling your location helps people that need your service find you.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleEnableLocation}
                  disabled={isLocating}
                  className="w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-70"
                >
                  {isLocating ? "Detecting location..." : "Enable Location"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEnable}
                  className="w-full rounded-2xl bg-primary-light py-3.5 text-center text-sm font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER 2: "Location Details" Bottom Sheet (Matching Screenshot 2) */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[440px] ${
            showEnableDialog ? "pointer-events-none opacity-60" : "opacity-100"
          }`}
        >
          <div className="rounded-t-3xl border-t border-border bg-white px-6 pb-8 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] sm:rounded-3xl sm:border sm:p-6 sm:shadow-2xl">
            {/* Drag Handle Pill (Mobile) */}
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-zinc-300 sm:hidden" />

            {/* Header with Title & Close Icon */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
                Location Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close location drawer"
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-foreground"
              >
                <CloseCircle size={22} color="currentColor" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleContinue} className="mt-5">
              <label
                htmlFor="provider-address-input"
                className="block text-xs font-bold text-foreground sm:text-sm"
              >
                Address
              </label>

              {/* Input container matching Screenshot 2 */}
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-2xs focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                <input
                  id="provider-address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your service address"
                  className="w-full bg-transparent text-xs font-semibold text-foreground placeholder-zinc-400 outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleEnableLocation}
                  title="Detect current location"
                  className="ml-2 flex shrink-0 items-center justify-center rounded-full p-1 text-primary transition-transform hover:scale-110 active:scale-95"
                >
                  <Location size={20} color="#3d5afe" variant="Bold" />
                </button>
              </div>

              {/* Continue Button */}
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={!address.trim()}
                  className="w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-50 sm:py-4"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
