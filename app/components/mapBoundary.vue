<script setup lang="ts">
import { watch, onUnmounted, toRaw } from "vue";
import NominatimRepository from "~/repositories/NominatimRepository";
import type { NominatimGeoJSON } from "~/repositories/NominatimRepository";
import app from "~/stores/app";

const { map } = defineProps<{
  map: google.maps.Map;
}>();

const nominatim = new NominatimRepository();
let polygons: google.maps.Polygon[] = [];

const STYLE = {
  fillColor: "#4285F4",
  fillOpacity: 0.1,
  strokeColor: "#4285F4",
  strokeWeight: 2,
  clickable: false,
};

function clearBoundary() {
  polygons.forEach((p) => p.setMap(null));
  polygons = [];
}

/** GeoJSON [lng, lat] ring → google.maps.LatLngLiteral[] */
function ringToLatLng(ring: number[][]): google.maps.LatLngLiteral[] {
  return ring.map(([lng, lat]) => ({ lat, lng }));
}

function drawGeojson(geojson: NominatimGeoJSON) {
  const rawMap = toRaw(map);

  const rings: number[][][] =
    geojson.type === "Polygon"
      ? geojson.coordinates
      : (geojson.coordinates as number[][][][]).flat();

  for (const ring of rings) {
    const poly = new google.maps.Polygon({
      paths: ringToLatLng(ring),
      map: rawMap,
      ...STYLE,
    });
    polygons.push(poly);
  }
}

const NO_BOUNDARY_TYPES = new Set([
  "street_address",
  "route",
  "premise",
  "subpremise",
  "street_number",
  "establishment",
  "point_of_interest",
  "tourist_attraction",
  "park",
  "natural_feature",
]);

/**
 * Mappe les types Google Maps vers le zoom Nominatim correspondant.
 * Beaucoup plus fiable que l'heuristique basée sur la taille du viewport.
 * Retourne null si le type n'est pas délimitable (adresse, POI...).
 */
function typesToNominatimZoom(types: string[] | undefined): number | null {
  if (!types?.length) return 10;
  if (types.some((t) => NO_BOUNDARY_TYPES.has(t))) return null;
  if (types.includes("country")) return 3;
  if (
    types.includes("administrative_area_level_1") ||
    types.includes("administrative_area_level_2")
  )
    return 5;
  if (
    types.includes("administrative_area_level_3") ||
    types.includes("administrative_area_level_4")
  )
    return 8;
  if (
    types.includes("locality") ||
    types.includes("postal_town") ||
    types.includes("political")
  )
    return 10;
  return 10;
}

watch(
  () => app.place,
  async (place) => {
    clearBoundary();
    if (!place?.location) return;

    const nominatimZoom = typesToNominatimZoom((place as any).types);
    if (nominatimZoom === null) return;

    const geojson = await nominatim.getBoundaryByLatLng(
      place.location.lat,
      place.location.lng,
      nominatimZoom,
    );
    if (!geojson) return;

    drawGeojson(geojson);
  },
);

onUnmounted(clearBoundary);
</script>

<template></template>
