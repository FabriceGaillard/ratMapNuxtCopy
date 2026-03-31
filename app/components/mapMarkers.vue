<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useNuxtApp } from "#app";
import { colorMap } from "~/utils/colors";

const { map, markers } = defineProps<{
  map: google.maps.Map;
  markers: any[];
}>();

const { $markersLibrary } = useNuxtApp();
let markerInstances: any[] = [];

function destroyMarkers() {
  markerInstances.forEach((m) => (m.map = null));
  markerInstances = [];
}

// 🧩 Récupérer le SVG depuis public et le transformer en DOM
async function fetchSvg(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "image/svg+xml").documentElement;
}

// 🧩 Création du marker DOM pur
async function createMarkerElement(color: string, iconUrl: string) {
  const colorClass = colorMap[color] || "bg-gray-600"; // fallback au cas où la couleur n'est pas trouvée
  // cercle blanc (outer)
  const outer = document.createElement("div");
  outer.className =
    "w-[22px] h-[22px] rounded-full bg-elevated flex items-center justify-center shadow-md";

  // cercle rouge (inner)
  const inner = document.createElement("div");
  inner.className = `w-[18px] h-[18px] rounded-full ${colorClass} text-inverted flex items-center justify-center`;

  // icône SVG
  const svg = await fetchSvg(iconUrl); // récupère public/heart.svg
  svg.setAttribute("width", "12"); // ajuste la taille
  svg.setAttribute("height", "12");
  inner.appendChild(svg);

  outer.appendChild(inner);
  return outer;
}

async function createMarkers() {
  destroyMarkers();

  for (const m of markers) {
    const content = await createMarkerElement(m.color, m.icon);

    const marker = new $markersLibrary.AdvancedMarkerElement({
      map: toRaw(map),
      position: {
        lat: m.geometry.coordinates[1],
        lng: m.geometry.coordinates[0],
      },
      content,
    });

    markerInstances.push(marker);
  }
}

watch(() => markers, createMarkers, { deep: true, immediate: true });
onUnmounted(destroyMarkers);
onMounted(createMarkers);
</script>

<template>
  <slot></slot>
</template>
