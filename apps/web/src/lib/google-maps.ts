import { useJsApiLoader } from "@react-google-maps/api";

// Libraries must be a static module-level reference to prevent re-instantiation
const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];
export const GOOGLE_MAPS_SCRIPT_ID = "google-map-script-shared";

export function useGoogleMapsLoader() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_SCRIPT_ID,
    googleMapsApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return {
    isLoaded,
    loadError,
    googleMapsApiKey,
    hasApiKey: Boolean(googleMapsApiKey.trim()),
  };
}
