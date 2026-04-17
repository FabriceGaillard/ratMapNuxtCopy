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

function ringToLatLng(ring: number[][]): google.maps.LatLngLiteral[] {
  return ring.map((coord) => ({
    lat: coord[1] as number,
    lng: coord[0] as number,
  }));
}

function clearBoundary() {
  polygons.forEach((p) => p.setMap(null));
  polygons = [];
}

function drawGeojson(geojson: NominatimGeoJSON) {
  const rawMap = toRaw(map);

  const rings: number[][][] =
    geojson.type === "Polygon"
      ? geojson.coordinates
      : (geojson.coordinates as number[][][][]).flat();

  for (const ring of rings) {
    polygons.push(
      new google.maps.Polygon({
        paths: ringToLatLng(ring),
        fillColor: "#ef4444",
        fillOpacity: 0.08,
        strokeColor: "#ef4444",
        strokeWeight: 2,
        strokeOpacity: 1,
        clickable: false,
        map: rawMap,
      }),
    );
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
  () => app.mode,
  (mode) => {
    if (mode === "itinerary" || mode === "route") {
      polygons.forEach((p) => p.setVisible(false));
    } else {
      polygons.forEach((p) => p.setVisible(true));
    }
  },
);

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
