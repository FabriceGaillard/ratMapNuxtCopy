<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useNuxtApp } from "#app";

const { map, markers } = defineProps<{
  map: google.maps.Map;
  markers: any[];
}>();

const { $markersLibrary } = useNuxtApp();

let markerInstances: google.maps.Marker[] = [];

function destroyMarkers() {
  markerInstances.forEach((m) => m.setMap(null));
  markerInstances = [];
}

function createMarkers() {
  destroyMarkers();
  markers.forEach((m) => {
    const marker = new $markersLibrary.Marker({
      position: {
        lat: m.geometry.coordinates[1],
        lng: m.geometry.coordinates[0],
      },
      anchor: { x: 25, y: 25 },
      map,
      // animation: google.maps.Animation.DROP,
    });
    markerInstances.push(marker);
  });
}

watch(() => markers, createMarkers, { deep: true, immediate: true });
onUnmounted(destroyMarkers);
onMounted(createMarkers);
</script>

<template>
  <slot></slot>
</template>
