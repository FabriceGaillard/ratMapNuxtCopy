import { Loader } from "@googlemaps/js-api-loader";

export const useGoogleMaps = () => {
  const loadGoogleMaps = async () => {
    if ((window as any).google?.maps) {
      return (window as any).google.maps;
    }

    const config = useRuntimeConfig();

    const loader = new Loader({
      apiKey: config.public.googleMapsKey,
      version: "weekly",
      libraries: ["places", "geocoding", "marker"], // 👈 AJOUT
    });

    await loader.importLibrary("maps");
    await loader.importLibrary("places");
    await loader.importLibrary("geocoding");
    await loader.importLibrary("marker"); // 👈 IMPORTANT

    return (window as any).google.maps;
  };

  return {
    loadGoogleMaps,
  };
};
