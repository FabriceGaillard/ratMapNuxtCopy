<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useNuxtApp } from "#app";
import { colorMap } from "~/utils/colors";
import { extractCityFromGeocodeResult } from "~/helpers/PlaceHelper";
import { fetchIcons } from "~/helpers/fetch";

const { map, markers } = defineProps<{
  map: google.maps.Map;
  markers: any[];
}>();

const emit = defineEmits<{
  select: [
    data: google.maps.places.PlaceResult & {
      marker: Record<string, unknown>;
    },
  ];
}>();

const icons = await fetchIcons();

const colorMode = useColorMode();
const { $markersLibrary, $placesLibrary, $geocodingLibrary } = useNuxtApp();
let markerInstances: any[] = [];
let geocoder: any = null;

function destroyMarkers() {
  markerInstances.forEach((m) => (m.map = null));
  markerInstances = [];
}

// 🧩 Récupérer le SVG depuis public et le transformer en DOM
async function fetchSvg(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.status}`);
    const text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "image/svg+xml").documentElement;
  } catch (error) {
    console.error("Error fetching SVG:", error);
    return null;
  }
}

// 🧩 Création du marker DOM pur
async function createMarkerElement(color: string, icon: keyof typeof icons) {
  try {
    const colorClass = colorMap[color] || "bg-neutral-600";
    // cercle blanc (outer)
    const outer = document.createElement("div");
    outer.className =
      "w-[22px] h-[22px] rounded-full bg-elevated flex items-center justify-center shadow-md";

    // cercle rouge (inner)
    const inner = document.createElement("div");
    inner.className = `w-[18px] h-[18px] rounded-full ${colorClass} text-inverted flex items-center justify-center`;

    // icône SVG
    const svg = icons[icon]!.cloneNode(true) as SVGElement;
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "12");
    inner.appendChild(svg);

    outer.appendChild(inner);
    return outer;
  } catch (error) {
    console.error("Error creating marker element:", error);
    const fallback = document.createElement("div");
    fallback.className = "w-[22px] h-[22px] rounded-full bg-neutral-500";
    return fallback;
  }
}

async function createMarkers() {
  try {
    destroyMarkers();

    if (!$markersLibrary) {
      console.error("Markers library not loaded");
      return;
    }

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

      marker.addListener("gmp-click", async () => {
        try {
          const lat = m.geometry.coordinates[1];
          const lng = m.geometry.coordinates[0];

          // Initialiser le geocoder si ce n'est pas fait
          if (!geocoder && $geocodingLibrary?.Geocoder) {
            geocoder = new $geocodingLibrary.Geocoder();
          }

          if (!geocoder) {
            console.warn("Geocoder not available");
            return;
          }

          // Recherche inverse pour trouver la place aux coordonnées
          const response = await geocoder.geocode({
            location: { lat, lng },
          });

          if (response.results && response.results.length > 0) {
            const result = response.results[0];
            const city = extractCityFromGeocodeResult(result);

            // Créer une place avec les résultats du géocodage
            emit("select", {
              formattedAddress: city,
              location: {
                lat,
                lng,
              },
              viewport: result.geometry.viewport,
              marker: m,
            });
          }
        } catch (error) {
          console.error("Error handling marker click:", error);
        }
      });

      markerInstances.push(marker);
    }
  } catch (error) {
    console.error("Error creating markers:", error);
  }
}

watch(() => [markers, colorMode], createMarkers, {
  deep: true,
  immediate: true,
});
onUnmounted(destroyMarkers);
onMounted(createMarkers);
</script>

<template>
  <slot></slot>
</template>
