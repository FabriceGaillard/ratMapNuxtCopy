<script setup lang="ts">
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";
import { onMounted, onUnmounted, watch } from "vue";
import { useNuxtApp } from "#app";

type RouteItem = Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>>;

const props = defineProps<{
  map: google.maps.Map;
  routes: RouteItem[];
  selectedRoute?: RouteItem | null;
}>();

const emit = defineEmits<{
  select: [route: RouteItem];
}>();

const colorMode = useColorMode();

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
  props.routes.forEach((route) => {
    // Bordure derrière
    const outlineLine = new $mapsLibrary.Polyline({
      path: route.path,
      map: props.map,
      strokeColor: "#403CE6",
      strokeWeight: 8,
      zIndex: 1,
    });

    // Ligne principale
    const mainLine = new $mapsLibrary.Polyline({
      path: route.path,
      map: props.map,
      strokeColor: "#BBCAFB",
      strokeWeight: 4,
      zIndex: 2,
    });

    // Marker origin
    const originMarker = new $markersLibrary.Marker({
      position: route.origin,
      map: props.map,
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
      map: props.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE, // rond
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeColor: "#000000",
        strokeWeight: 2,
        scale: 4,
      },
    });

    outlineLine.addListener("click", () => emit("select", route));
    mainLine.addListener("click", () => emit("select", route));
    destinationMarker.addListener("click", () => emit("select", route));

    routeInstances.push({
      outlineLine,
      mainLine,
      originMarker,
      destinationMarker,
    });
  });
}

function isSelected(route: RouteItem) {
  return (
    props.selectedRoute?.destination.lat === route.destination.lat &&
    props.selectedRoute?.destination.lng === route.destination.lng
  );
}

function applyHighlight(index: number, highlighted: boolean) {
  const instance = routeInstances[index];
  if (!instance) return;
  instance.outlineLine.setOptions({
    strokeColor: highlighted ? "#365C80" : "#403CE6",
    strokeWeight: 8,
    zIndex: highlighted ? 10 : 1,
  });
  instance.mainLine.setOptions({
    strokeColor: highlighted ? "#71E8FE" : "#BBCAFB",
    strokeWeight: 4,
    zIndex: highlighted ? 11 : 2,
  });
}

watch(
  () => props.selectedRoute,
  () => {
    props.routes.forEach((route, index) => {
      applyHighlight(index, isSelected(route));
    });
  },
);

watch(() => [props.routes, colorMode], createRoutes, {
  deep: true,
  immediate: true,
});
onUnmounted(destroyRoutes);
onMounted(createRoutes);
</script>

<template>
  <slot></slot>
</template>
