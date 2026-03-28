<script setup lang="ts">
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";
import { onMounted, onUnmounted, watch } from "vue";
import { useNuxtApp } from "#app";

const { map, routes } = defineProps<{
  map: google.maps.Map;
  routes: Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>>[];
}>();

const { $mapsLibrary, $markersLibrary } = useNuxtApp();

let routeInstances: {
  outlineLine: any;
  mainLine: any;
  originMarker: any;
  destinationMarker: any;
}[] = [];

function destroyRoutes() {
  routeInstances.forEach((instance) => {
    instance.outlineLine?.setMap(null);
    instance.mainLine?.setMap(null);
    instance.originMarker?.setMap(null);
    instance.destinationMarker?.setMap(null);
  });
  routeInstances = [];
}

function createRoutes() {
  destroyRoutes();
  routes.forEach((route) => {
    // Bordure derrière
    const outlineLine = new $mapsLibrary.Polyline({
      path: route.path,
      map,
      strokeColor: "#403CE6",
      strokeWeight: 8,
      zIndex: 1,
    });

    // Ligne principale
    const mainLine = new $mapsLibrary.Polyline({
      path: route.path,
      map,
      strokeColor: "#BBCAFB",
      strokeWeight: 4,
      zIndex: 2,
    });

    // Marker origin
    const originMarker = new $markersLibrary.Marker({
      position: route.origin,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE, // rond
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeColor: "#000000",
        strokeWeight: 2,
        scale: 4,
      },
    });

    // Marker destination
    const destinationMarker = new $markersLibrary.Marker({
      position: route.destination,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE, // rond
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeColor: "#000000",
        strokeWeight: 2,
        scale: 4,
      },
    });

    routeInstances.push({
      outlineLine,
      mainLine,
      originMarker,
      destinationMarker,
    });
  });
}

watch(() => routes, createRoutes, { deep: true, immediate: true });
onUnmounted(destroyRoutes);
onMounted(createRoutes);
</script>

<template>
  <slot></slot>
</template>