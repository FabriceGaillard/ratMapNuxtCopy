<template>
  <div :class="['relative w-full h-screen overflow-hidden w-full']">
    <div :class="{ hidden: streetViewVisible }">
      <!-- Search Container -->
      <div
        class="absolute w-full z-10 top-0, left-0 flex p-4 gap-2 items-center"
      >
        <div>
          <UFieldGroup :ui="{}">
            <div id="searchBox" />
            <UButton
              id="directionsBtn"
              icon="lucide:split"
              aria-label="Itinéraire"
              color="neutral"
              variant="subtle"
              size="xl"
              square
              :ui="{ leadingIcon: 'w-4 h-4' }"
              @click="handleDirections"
            />
          </UFieldGroup>
        </div>
        <UDropdownMenu :items="items" class="ml-auto">
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="soft"
            square
            size="xl"
          />
        </UDropdownMenu>
      </div>

      <div
        v-if="!directionsPanel.open"
        :class="['absolute bottom-6 left-0 px-3 z-5 w-full']"
      >
        <DurationSlider
          :model-value="maxHours"
          @update:model-value="maxHours = $event"
        />
      </div>
    </div>
    <!-- Vertical Slider -->

    <!-- Map -->
    <div id="map" class="w-full h-full" />

    <!-- POI Details Drawer -->
    <!-- <PoiDetailsDrawer
      :open="panel.open"
      :poi="panel.poi"
      @close="panel.open = false"
    /> -->

    <!-- Directions Drawer -->
    <DirectionsDrawer
      :max-hours="maxHours"
      :open="directionsPanel.open"
      :directions="directionsPanel.directions"
      @close="directionsPanel.open = false"
      @update-max-hours="maxHours = $event"
      @recalculate="handleDirections"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { usePois } from "~/composables/usePois";
import { useSearch } from "~/composables/useSearch";
import { useDirections } from "~/composables/useDirections";
import { useGoogleMaps } from "~/composables/useGoogleMaps";
import { usePoiDetails } from "~/composables/usePoiDetails";

// maps configuration has been moved to a utility module
import { createMaps } from "~/utils/maps";

const { getPois } = usePois();
const { initSearch, selectedPlace } = useSearch();
const { initDirections, clearDirections } = useDirections();
const { loadGoogleMaps } = useGoogleMaps();
const { enrichPoiData } = usePoiDetails();

// theme example (without useTheme)
const appConfig = useAppConfig();

const getHex = (color: string, shade = 500) => {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--ui-color-${color}-${shade}`)
      .trim() || "#000"
  );
};

const maxHours = ref(5);

const panel = reactive({
  open: false,
  poi: null,
});

const directionsPanel = reactive({
  open: false,
  directions: [],
});

let map: any = null;
let searchBox: any = null;
let pois: any[] = [];
let markers: any[] = [];
let originMarker: any = null;

// flag to hide main container when Street View is active
const streetViewVisible = ref(false);

// 'maps' will be initialized via factory so that it can refer to refreshPois
let maps: any[] = [];

// items depends on maps, update after maps is created
const items = ref<any[]>([]);

const createMap = (): any => {
  const mapElement = document.getElementById("map");
  return new (window as any).google.maps.Map(mapElement, {
    zoom: 5,
    center: { lat: 46.5, lng: 2.5 },
    disableDefaultUI: true,
    mapId: "DEMO_MAP_ID",
  });
};

const displayPois = async (poisData: any[]) => {
  // Clear all previous markers
  markers.forEach((marker) => (marker.map = null));
  markers = [];

  const { AdvancedMarkerElement, PinElement } = (await (
    window as any
  ).google.maps.importLibrary("marker")) as any;

  // Add new markers
  poisData.forEach((poi: any) => {
    const pinElement = new PinElement({
      background: getHex(poi.map.color, 500),
      borderColor: getHex(poi.map.color, 700),
      glyphColor: "white",
    });

    const marker = new AdvancedMarkerElement({
      position: poi.position,
      map,
      title: poi.name,
      content: pinElement,
    });

    marker.addEventListener("gmp-click", async () => {
      const enrichedPoi = await enrichPoiData(poi);
      panel.poi = enrichedPoi;
      console.log(enrichedPoi);
      panel.open = true;

      // pan to the clicked POI and set a fixed zoom level
      map.panTo(poi.position);
      map.setZoom(7);
    });

    markers.push(marker);
  });
};

const handleDirections = async () => {
  const place = selectedPlace.value;
  if (!place) {
    console.warn("Please search for a location first");
    return;
  }

  // Remove previous origin marker if it exists
  if (originMarker) {
    originMarker.map = null;
  }

  // Add new origin marker at the search location
  const { AdvancedMarkerElement, PinElement } = (await (
    window as any
  ).google.maps.importLibrary("marker")) as any;

  const originLocation = place.location;
  if (originLocation) {
    const pinElement = new PinElement({
      background: "white",
      borderColor: "black",
    });

    originMarker = new AdvancedMarkerElement({
      position: originLocation,
      map,
      title: "Point de départ",
      content: pinElement,
    });
  }

  const origin = place.formattedAddress || place.displayName;
  const results = await initDirections(map, pois, origin, maxHours.value);

  if (results.length > 0) {
    // Enrich POI data with additional details
    const enrichedResults = await Promise.all(
      results.map(async (result) => ({
        ...result,
        poi: await enrichPoiData(result.poi),
      })),
    );
    directionsPanel.directions = enrichedResults;
    directionsPanel.open = true;
  } else {
    console.warn("No directions found for the given criteria");
  }
};

async function refreshPois() {
  pois = await Promise.all(
    maps
      .filter((e) => e.checked.value)
      .map(async (map) => {
        const data = await getPois(map.id, maxHours.value);
        return data.map((poi: any) => ({ ...poi, map }));
      }),
  ).then((results) => results.flat());
  await displayPois(pois);
}

// create the maps array once refreshPois is defined
maps = createMaps(refreshPois);
// initialize items now that maps exists
items.value = [
  [
    {
      label: "Points of Interest",
      type: "label",
      icon: "lucide:house-heart",
    },
  ],
  maps,
];

onMounted(async () => {
  // Load Google Maps API
  await loadGoogleMaps();

  // Initialize map
  map = createMap();

  // listen for Street View visibility changes
  const street = map.getStreetView();
  street.addListener("visible_changed", () => {
    streetViewVisible.value = street.getVisible();
  });

  // Initialize search
  searchBox = await initSearch(map);

  // Load and display POIs
  await refreshPois();
});
</script>
