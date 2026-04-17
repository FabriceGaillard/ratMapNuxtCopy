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

watch(
  () => app.place,
  async (place) => {
    clearBoundary();
    if (!place?.location) return;

    const geojson = await nominatim.getBoundaryByLatLng(
      place.location.lat,
      place.location.lng,
    );
    if (!geojson) return;

    drawGeojson(geojson);
  },
);

onUnmounted(clearBoundary);
</script>

<template></template>
