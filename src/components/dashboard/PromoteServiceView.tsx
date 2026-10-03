"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Location,
  Calendar,
  Sms,
  CloseCircle,
  TickCircle,
  ArrowDown2,
  ArrowUp2,
  Clock,
  MoneyRecive,
  DocumentText,
  ArrowLeft2,
} from "iconsax-react";
import { categories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import { useAuthStore } from "@/store/useAuthStore";

interface PromoteServiceViewProps {
  onSuccess?: () => void;
  isStandalonePage?: boolean;
}

const defaultSamplePhotos = [
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
];

const durationOptions = [
  { value: "7 days", label: "7 days" },
  { value: "14 days", label: "14 days" },
  { value: "30 days", label: "30 days" },
];

export function PromoteServiceView({ onSuccess, isStandalonePage = false }: PromoteServiceViewProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Form State
  const [adTitle, setAdTitle] = useState("Affordable Generator Repair in Ikeja");
  const [description, setDescription] = useState(
    "Professional generator repair and maintenance services. We specialize in residential and commercial generators of all brands. Fast response times and quality workmanship guaranteed."
  );
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("cleaning-waste");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [targetLocation, setTargetLocation] = useState("Port Harcourt, Rivers");
  const [adDuration, setAdDuration] = useState("30 days");
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>(defaultSamplePhotos);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  // Modal / Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"details" | "media">("details");
  const [isPosting, setIsPosting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const businessName = user?.first_name ? `${user.first_name}'s Solutions` : "John Power Solutions";
  const selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);
  const SelectedIcon = selectedCategory ? categoryIcons[selectedCategory.slug] : null;

  const isFormValid = adTitle.trim().length > 0 && description.trim().length > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create object URLs for uploaded files up to 3 total
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length && photos.length + newPhotos.length < 3; i++) {
      const url = URL.createObjectURL(files[i]);
      newPhotos.push(url);
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3));
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (selectedMediaIndex >= photos.length - 1) {
      setSelectedMediaIndex(Math.max(0, photos.length - 2));
    }
  };

  const handlePostAd = () => {
    if (!isFormValid || isPosting) return;
    setIsPosting(true);

    setTimeout(() => {
      setIsPosting(false);
      setIsPreviewOpen(false);
      setToastMessage("Your ad has been published successfully!");
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    }, 800);
  };

  // Reusable Preview Card Content (used both in modal and desktop side-by-side view)
  const renderPreviewCardContent = () => (
    <div className="flex flex-col">
      {/* Provider Business Profile Header */}
      <div className="flex flex-col items-center text-center">
        {/* Silhouette avatar matching mockup */}
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-2 ring-border">
          <svg className="h-16 w-16 text-zinc-900" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 20 a 16 16 0 1 0 0 32 a 16 16 0 0 0 0 -32 Z M26 84 C26 66 38 60 50 60 C62 60 74 66 74 84 Z" />
          </svg>
        </div>

        <h3 className="mt-3 text-base font-extrabold text-foreground sm:text-lg">
          {businessName}
        </h3>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-600">
          Family owned business with 15+ years of experience in power solutions and electrical services.
        </p>
      </div>

      {/* Main Preview Container Card */}
      <div className="mt-5 rounded-3xl border border-border/80 bg-white p-4 shadow-xs sm:p-5">
        {/* Segmented Pill Tabs: Ad Details | Media */}
        <div className="flex items-center rounded-full bg-[#f4f7f5] p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPreviewTab("details")}
            className={`flex-1 rounded-full py-2 text-center transition-all ${
              previewTab === "details"
                ? "bg-[#dcfce7] text-[#166534] shadow-xs"
                : "text-zinc-600 hover:text-foreground"
            }`}
          >
            Ad Details
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("media")}
            className={`flex-1 rounded-full py-2 text-center transition-all ${
              previewTab === "media"
                ? "bg-[#dcfce7] text-[#166534] shadow-xs"
                : "text-zinc-600 hover:text-foreground"
            }`}
          >
            Media
          </button>
        </div>

        {/* TAB 1: Ad Details */}
        {previewTab === "details" && (
          <div className="mt-5 space-y-4 animate-in fade-in">
            {/* Ad Title & Announcement Icon */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-primary">
                <DocumentText size={14} color="#3d5afe" variant="Bold" />
              </div>
              <h4 className="text-sm font-extrabold text-foreground sm:text-base">
                {adTitle || "Affordable Generator Repair in Ikeja"}
              </h4>
            </div>

            {/* Description Body */}
            <p className="text-xs leading-relaxed text-zinc-600 pl-8.5">
              {description ||
                "Professional generator repair and maintenance services. We specialize in residential and commercial generators of all brands."}
            </p>

            {/* Specs with Green Icons */}
            <div className="space-y-2.5 pl-8.5 text-xs text-zinc-700">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Location size={13} color="#059669" variant="Bold" />
                </div>
                <span>{targetLocation || "Port Harcourt, Rivers"}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Clock size={13} color="#059669" variant="Bold" />
                </div>
                <span>Mon-Fri, 8AM-6PM</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <MoneyRecive size={13} color="#059669" variant="Bold" />
                </div>
                <span>Starting at $35/hour</span>
              </div>
            </div>

            {/* Communication Notice */}
            <div className="mt-4 flex items-start gap-2.5 border-t border-border/50 pt-3.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                <Sms size={14} color="#3d5afe" variant="Bold" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Communication</h5>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Clients will be able to message you directly after you publish this ad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Media (Matching Newly Attached Screens) */}
        {previewTab === "media" && (
          <div className="mt-5 space-y-4 animate-in fade-in">
            {photos.length === 0 ? (
              /* Empty Media State (Screen 1) */
              <div className="space-y-3">
                <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-[#f0fdf4]/80 border border-emerald-100 text-emerald-700">
                  <span className="text-xs font-semibold text-emerald-600">No media uploaded</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 rounded-xl bg-[#f0fdf4]/80 border border-emerald-100" />
                  <div className="h-16 rounded-xl bg-[#f0fdf4]/80 border border-emerald-100" />
                  <div className="h-16 rounded-xl bg-[#f0fdf4]/80 border border-emerald-100" />
                </div>
              </div>
            ) : (
              /* Media Loaded with Main Display & 3 Thumbnails (Screen 2 & 3) */
              <div className="space-y-3">
                {/* Large Main Media Display */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-xs sm:h-52">
                  <Image
                    src={photos[selectedMediaIndex] || photos[0]}
                    alt="Promoted service main view"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-all duration-300"
                  />
                </div>

                {/* 3 Selectable Thumbnails */}
                <div className="grid grid-cols-3 gap-2.5">
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`relative h-18 w-full overflow-hidden rounded-xl border-2 transition-all ${
                        selectedMediaIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-200"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                  {/* Fill empty spots if less than 3 photos */}
                  {Array.from({ length: Math.max(0, 3 - photos.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex h-18 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50"
                    >
                      <span className="text-[10px] text-zinc-400">Empty</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Notice */}
            <div className="mt-4 flex items-start gap-2.5 border-t border-border/50 pt-3.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
                <Sms size={14} color="#3d5afe" variant="Bold" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Communication</h5>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Clients will be able to message you directly after you publish this ad.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Ad Button inside Preview */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handlePostAd}
          disabled={!isFormValid || isPosting}
          className="w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-50"
        >
          {isPosting ? "Publishing Ad..." : "Post Ad"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm text-white shadow-xl sm:bottom-6 sm:right-6">
          <TickCircle size={18} color="#3d5afe" variant="Bold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standalone Back Nav if needed */}
      {isStandalonePage && (
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground">
          <Link href="/dashboard" className="flex items-center gap-1.5 transition-colors">
            <ArrowLeft2 size={16} color="currentColor" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      )}

      {/* Header Section (Matching Figma Mockup 1) */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
          Promote your Services
        </h1>
        <p className="mt-1 text-sm font-semibold text-emerald-600 sm:text-base">
          Create an ad to showcase what you do and reach more clients
        </p>
      </div>

      {/* Grid Layout: Desktop 2-column (7 cols form + 5 cols live preview), Tablet/Mobile single column */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Fields */}
        <div className="space-y-6 lg:col-span-7">
          {/* Ad Title */}
          <div>
            <label
              htmlFor="ad-title"
              className="block text-xs font-bold text-foreground sm:text-sm"
            >
              Ad Title
            </label>
            <input
              id="ad-title"
              type="text"
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              placeholder="e.g., Affordable Generator Repair in Ikeja"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-foreground placeholder-zinc-400 shadow-2xs outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="ad-description"
              className="block text-xs font-bold text-foreground sm:text-sm"
            >
              Description
            </label>
            <textarea
              id="ad-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your services, experience, pricing and what makes you stand out."
              className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-medium text-foreground placeholder-zinc-400 shadow-2xs outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
            />
          </div>

          {/* Service Category */}
          <div className="relative">
            <label
              htmlFor="service-category"
              className="block text-xs font-bold text-foreground sm:text-sm"
            >
              Service Category
            </label>
            <button
              id="service-category"
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className="mt-2 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs shadow-2xs transition-all hover:border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
            >
              {selectedCategory && SelectedIcon ? (
                <span className="flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  <SelectedIcon size={16} color="#059669" variant="Bold" />
                  <span>{selectedCategory.label}</span>
                </span>
              ) : (
                <span className="text-zinc-400">Select</span>
              )}
              {isCategoryDropdownOpen ? (
                <ArrowUp2 size={16} color="#71717a" />
              ) : (
                <ArrowDown2 size={16} color="#71717a" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isCategoryDropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-xl animate-in fade-in">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.slug];
                  const isSelected = selectedCategorySlug === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-primary-light font-bold text-primary"
                          : "text-foreground hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} color="currentColor" variant="Linear" />
                        <span>{cat.label}</span>
                      </div>
                      {isSelected && <TickCircle size={16} color="#3d5afe" variant="Bold" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Photos/Videos */}
          <div>
            <label className="block text-xs font-bold text-foreground sm:text-sm">
              Photos/Videos
            </label>
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              {/* Existing Uploaded Thumbnails */}
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xs"
                >
                  <Image
                    src={photo}
                    alt={`Work photo ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    aria-label="Remove photo"
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <CloseCircle size={14} color="#ffffff" />
                  </button>
                </div>
              ))}

              {/* Dashed Add Media Box (if less than 3 photos) */}
              {photos.length < 3 && (
                <label className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-[#eef2ff] text-primary transition-all hover:border-primary hover:bg-[#e0e7ff] active:scale-95">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-2xs">
                    <DocumentText size={18} color="#3d5afe" variant="Bold" />
                  </div>
                  <span className="mt-1 text-[11px] font-bold">Add Media</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Upload up to 3 photos or videos of your work (Max 5MB each)
            </p>
          </div>

          {/* Target Location */}
          <div>
            <label
              htmlFor="target-location"
              className="block text-xs font-bold text-foreground sm:text-sm"
            >
              Target Location
            </label>
            <div className="mt-2 flex items-center rounded-xl border border-zinc-200 bg-white px-3.5 py-3 shadow-2xs focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Location size={18} color="#3d5afe" variant="Bold" className="shrink-0" />
              <input
                id="target-location"
                type="text"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                placeholder="Enter service area e.g Ikeja, Lagos"
                className="ml-2.5 w-full bg-transparent text-xs font-medium text-foreground placeholder-zinc-400 outline-none sm:text-sm"
              />
            </div>
          </div>

          {/* Ad Duration */}
          <div className="relative">
            <label
              htmlFor="ad-duration"
              className="block text-xs font-bold text-foreground sm:text-sm"
            >
              Ad Duration
            </label>
            <button
              id="ad-duration"
              type="button"
              onClick={() => setIsDurationDropdownOpen((prev) => !prev)}
              className="mt-2 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-xs shadow-2xs transition-all hover:border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={18} color="#3d5afe" variant="Bold" />
                <span className="font-semibold text-foreground">{adDuration}</span>
              </div>
              {isDurationDropdownOpen ? (
                <ArrowUp2 size={16} color="#71717a" />
              ) : (
                <ArrowDown2 size={16} color="#71717a" />
              )}
            </button>

            {/* Duration Dropdown Menu matching Screenshot 4 */}
            {isDurationDropdownOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 rounded-2xl border border-border bg-white p-2 shadow-xl animate-in fade-in">
                {durationOptions.map((opt) => {
                  const isSelected = adDuration === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setAdDuration(opt.value);
                        setIsDurationDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-primary-light text-primary"
                          : "text-foreground hover:bg-zinc-100"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <TickCircle size={16} color="#3d5afe" variant="Bold" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile / Tablet Form Footer Actions */}
          <div className="mt-8 flex items-center justify-between gap-4 pt-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="text-sm font-bold text-primary hover:underline"
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handlePostAd}
              disabled={!isFormValid || isPosting}
              className={`rounded-2xl px-8 py-3.5 text-center text-sm font-bold transition-all ${
                isFormValid
                  ? "bg-primary text-white shadow-md hover:bg-primary-dark active:scale-95"
                  : "cursor-not-allowed bg-zinc-300 text-white"
              }`}
            >
              {isPosting ? "Posting..." : "Post Ad"}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview on Desktop (>= 1024px) */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-6 rounded-3xl border border-border/80 bg-zinc-50/70 p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Live Ad Preview
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                Active View
              </span>
            </div>
            {renderPreviewCardContent()}
          </div>
        </div>
      </div>

      {/* POPUP MODAL: "Your Ads Preview" Modal (Matching Figma Mockups) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs animate-in fade-in">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-base font-extrabold text-foreground sm:text-lg">
                Your Ads Preview
              </h3>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close preview"
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-foreground"
              >
                <CloseCircle size={22} color="currentColor" />
              </button>
            </div>

            {/* Inner Content */}
            <div className="mt-4">{renderPreviewCardContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
