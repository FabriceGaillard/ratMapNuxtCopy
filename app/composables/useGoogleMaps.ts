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
      libraries: ["places"]
    });

    await loader.importLibrary("maps");
    await loader.importLibrary("places");

    return (window as any).google.maps;
  };

  return {
    loadGoogleMaps
  };
};
