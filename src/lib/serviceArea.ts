import { artisansApi } from "@/lib/api/artisans";

/** Save where the provider works. Coordinates (when the browser gave them) let customers see the distance. */
export function saveServiceArea(address: string, coords?: { latitude: number; longitude: number }) {
  return artisansApi.setServiceArea({
    location: address.slice(0, 100),
    ...(coords ? { latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) } : {}),
  });
}
