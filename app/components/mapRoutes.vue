<script setup lang="ts">
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";
import { onUnmounted, watch } from "vue";

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

let dataLayer: google.maps.Data | null = null;
let clickListener: google.maps.MapsEventListener | null = null;

function getSelectedIndex() {
  if (!props.selectedRoute) return -1;
  return props.routes.findIndex(
    (r) =>
      r.destination.lat === props.selectedRoute!.destination.lat &&
      r.destination.lng === props.selectedRoute!.destination.lng,
  );
}

function getStyle(feature: google.maps.Data.Feature) {
  const selectedIndex = getSelectedIndex();
  const id = feature.getId();
  const isPoint = typeof id === "string";

  if (isPoint) {
    return {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeColor: "#403CE6",
        strokeWeight: 2,
        scale: 5,
      },
      zIndex: 3,
    };
  }

  const numId = id as number;
  const isOutline = numId < 0;
  const index = isOutline ? -numId - 1 : numId;
  const isSelected = index === selectedIndex;

  if (isOutline) {
    return {
      strokeColor: isSelected ? "#365C80" : "#403CE6",
      strokeWeight: 8,
      strokeOpacity: 1,
      zIndex: isSelected ? 10 : 1,
      clickable: false,
    };
  }

  return {
    strokeColor: isSelected ? "#71E8FE" : "#BBCAFB",
    strokeWeight: 4,
    strokeOpacity: 1,
    zIndex: isSelected ? 11 : 2,
  };
}

function destroyRoutes() {
  if (clickListener) {
    google.maps.event.removeListener(clickListener);
    clickListener = null;
  }
  if (dataLayer) {
    dataLayer.setMap(null);
    dataLayer = null;
  }
}

function createRoutes() {
  destroyRoutes();
  if (!props.routes.length) return;

  const features: object[] = [];
  for (let i = 0; i < props.routes.length; i++) {
    const route = props.routes[i]!;
    const coords = route.path.map((p) => [p.lng, p.lat]);

    // Outline (negative id = not clickable outline)
    features.push({
      type: "Feature",
      id: -(i + 1),
      properties: { index: i },
      geometry: { type: "LineString", coordinates: coords },
    });
    // Main line
    features.push({
      type: "Feature",
      id: i,
      properties: { index: i },
      geometry: { type: "LineString", coordinates: coords },
    });
    // Destination dot
    features.push({
      type: "Feature",
      id: `d_${i}`,
      properties: { index: i },
      geometry: {
        type: "Point",
        coordinates: [route.destination.lng, route.destination.lat],
      },
    });
  }

  dataLayer = new google.maps.Data({ map: props.map });
  dataLayer.addGeoJson({ type: "FeatureCollection", features });
  dataLayer.setStyle(getStyle);

  clickListener = dataLayer.addListener(
    "click",
    (e: google.maps.Data.MouseEvent) => {
      const id = e.feature.getId();
      if (typeof id === "number" && id < 0) return; // outline, ignore
      const index =
        typeof id === "string"
          ? parseInt((id as string).slice(2))
          : (id as number);
      const route = props.routes[index];
      if (route) emit("select", route);
    },
  );
}

watch(
  () => props.selectedRoute,
  () => dataLayer?.setStyle(getStyle),
);
watch(() => [props.routes, colorMode.value], createRoutes, { immediate: true });
onUnmounted(destroyRoutes);
</script>

<template>
  <slot></slot>
</template>
