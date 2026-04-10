import { defineNuxtPlugin } from "#app";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  setOptions({ key: config.public.googleMapsApiKey, v: "weekly" });

  // Charger les libs une seule fois
  const mapsLibrary = await importLibrary("maps");
  const placesLibrary = await importLibrary("places");
  const markersLibrary = await importLibrary("marker");
  const coreLibrary = await importLibrary("core");
  const routesLibrary = await importLibrary("routes");
  const geocodingLibrary = await importLibrary("geocoding");

  // Passer aussi google globalement pour accéder aux APIs
  const google = (window as any).google;

  // Fournir globalement
  nuxtApp.provide("mapsLibrary", mapsLibrary);
  nuxtApp.provide("placesLibrary", placesLibrary);
  nuxtApp.provide("markersLibrary", markersLibrary);
  nuxtApp.provide("coreLibrary", coreLibrary);
  nuxtApp.provide("routesLibrary", routesLibrary);
  nuxtApp.provide("geocodingLibrary", geocodingLibrary);
  nuxtApp.provide("google", google);
});
