<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";
import app from "~/stores/app";

const { $mapsLibrary, $placesLibrary, $coreLibrary } = useNuxtApp();

const mapElement = ref<HTMLDivElement | null>(null);
const map = ref<$mapsLibrary.Map | null>(null);

let zoom = 5.7;
let center = { lat: 46.603354, lng: 1.888334 };

const colorMode = useColorMode();
const config = useRuntimeConfig();

let zoomListener: any = null;
let centerListener: any = null;
let clickListener: any = null;

// 👉 NEW
let featureLayer: any = null;

function deleteMap() {
  if (zoomListener) zoomListener.remove();
  if (centerListener) centerListener.remove();
  if (clickListener) clickListener.remove();

  map.value = null;
  mapElement.value!.innerHTML = "";
}

const emit = defineEmits<{
  select: (place: google.maps.places.PlaceResult) => void;
}>();

async function createMap() {
  if (map.value) deleteMap();

  map.value = new $mapsLibrary.Map(mapElement.value, {
    zoom,
    center,
    renderingType: $mapsLibrary.RenderingType.VECTOR,
    mapId: config.public.googleMapId,
    disableDefaultUI: true,
    gestureHandling: "greedy",
    colorScheme:
      colorMode.value === "dark"
        ? $coreLibrary.ColorScheme.DARK
        : $coreLibrary.ColorScheme.LIGHT,
  });

  // 👉 NEW: récupération du layer des boundaries
  featureLayer = map.value.getFeatureLayer(
    $mapsLibrary.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1,
  );

  zoomListener = map.value.addListener("zoom_changed", () => {
    zoom = map.value.getZoom();
  });

  centerListener = map.value.addListener("center_changed", () => {
    const c = map.value.getCenter();
    center = { lat: c.lat(), lng: c.lng() };
  });

  clickListener = map.value.addListener("click", async (event: any) => {
    event.stop();
    if (!event.placeId || app.mode === "itinerary") return;

    const place = new $placesLibrary.Place({ id: event.placeId });

    await place.fetchFields({
      fields: ["formattedAddress", "location", "viewport", "id"],
    });

    map.value?.fitBounds(place.viewport);

    emit("select", {
      formattedAddress: place.formattedAddress,
      viewport: place.viewport,
      id: place.id,
      location: {
        lat: place.location.lat(),
        lng: place.location.lng(),
      },
    });
  });
}

watch(
  () => app,
  () => {
    if (!map.value) return;
    if (app.mode === "itinerary") {
      // Centrer sur la France
      const franceBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(43, -5), // SW
        new google.maps.LatLng(52, 8.5), // NE
      );

      // const drawerHeight = window.innerHeight * 0.45 + 50;
      map.value.fitBounds(franceBounds, {
        bottom: 200,
      });
    }
  },
  { deep: true },
);

watch(() => colorMode.value, createMap);

onMounted(createMap);
</script>

<template>
  <div>
    <div ref="mapElement" v-bind="$attrs" />
    <slot :map="map" />
  </div>
</template>
