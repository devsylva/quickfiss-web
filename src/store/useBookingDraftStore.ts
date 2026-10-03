import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdbStorage } from "@/lib/idbStorage";

interface PersistedDraft {
  /** The provider these photos were chosen for. */
  providerId: string | null;
  photos: File[];
}

interface BookingDraftState extends PersistedDraft {
  setPhotos: (providerId: string, photos: File[]) => void;
  /** Photos chosen for this provider (none if the draft belongs to someone else). */
  photosFor: (providerId: string) => File[];
  clear: () => void;
}

// Photos can't travel in the URL like the other wizard answers, so they are kept here
// (in IndexedDB, as real files) and survive a refresh between steps 3 and 4.
// Hydration is manual: the booking flow gate rehydrates before rendering any step.
export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set, get) => ({
      providerId: null,
      photos: [],
      setPhotos: (providerId, photos) => set({ providerId, photos }),
      photosFor: (providerId) => (get().providerId === providerId ? get().photos : []),
      clear: () => {
        set({ providerId: null, photos: [] });
        void useBookingDraftStore.persist.clearStorage();
      },
    }),
    {
      name: "booking-draft",
      version: 1,
      storage: createIdbStorage<PersistedDraft>(),
      skipHydration: true,
      partialize: (state) => ({ providerId: state.providerId, photos: state.photos }),
    }
  )
);
