<template>
  <div :class="['relative w-full h-screen overflow-hidden w-full']">
    <div :class="{ hidden: streetViewVisible }">
      <!-- Search Container -->
      <div :class="['absolute top-3 left-3 z-5']">
        <UFieldGroup>
          <UInput
            id="searchBox"
            v-model="searchQuery"
            placeholder="Chercher un lieu..."
            icon="i-heroicons-magnifying-glass-20-solid"
            class="w-[250px]"
          />
          <UButton
            id="searchBtn"
            icon="i-heroicons-magnifying-glass-20-solid"
            aria-label="Rechercher"
            color="neutral"
            variant="subtle"
          />
          <UButton
            id="directionsBtn"
            icon="lucide:split"
            aria-label="Itinéraire"
            color="neutral"
            variant="subtle"
            @click="handleDirections"
            square
            :ui="{
              leadingIcon: 'w-4 h-4',
            }"
          />
        </UFieldGroup>
      </div>
      <UDropdownMenu :items="items" class="fixed top-3 right-3 z-10">
        <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
      </UDropdownMenu>

      <div :class="['absolute bottom-6 left-0 px-3 z-5 w-full']">
        <USlider
          v-model="maxHours"
          :min="1"
          :max="15"
          :step="1 / 12"
          class="w-full"
          color="gray"
          :tooltip="{
            open: true,
            text: displayHours,
          }"
          size="xl"
        />
      </div>
    </div>
    <!-- Vertical Slider -->

    <!-- Map -->
    <div id="map" class="w-full h-full" />

    <!-- POI Details Drawer -->
    <PoiDetailsDrawer
      :open="panel.open"
      :poi="panel.poi"
      @close="panel.open = false"
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
const { initSearch } = useSearch();
const { initDirections } = useDirections();
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

const displayHours = computed(() => {
  const h = Math.floor(maxHours.value);
  const m = Math.round((maxHours.value - h) * 60);

  return `${h}h ${m ? m + "min" : ""}`;
});

const searchQuery = ref("");
const panel = reactive({
  open: false,
  poi: null,
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
  });
};

const displayPois = (poisData: any[]) => {
  // Clear all previous markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  // Add new markers
  poisData.forEach((poi: any) => {
    const marker = new (window as any).google.maps.Marker({
      position: poi.position,
      map,
      title: poi.name,
      icon: {
        path: `M6.99805 0C7.73296 0 8.44304 0.116279 9.11426 0.324219H9.11523C10.8849 0.882051 12.3567 2.14003 13.209 3.77344L13.207 3.77539L13.21 3.77344C13.7142 4.74583 14.0107 5.84765 14.0107 7.02734C14.0107 11.2918 11.2868 12.9649 8.9502 16.6338C7.52989 18.8385 7.92983 20.16 7.0127 20.1602C6.10799 20.1602 6.53455 18.8384 5.11328 16.6338C4.71282 16.0118 4.31242 15.4406 3.89941 14.9092V14.9102C2.64671 13.2894 1.43316 11.9927 0.697266 10.3857V10.3848L0.541016 10.0195C0.197387 9.15311 0 8.18396 0 7.02734C4.85639e-05 5.31612 0.619682 3.73434 1.63965 2.51562L1.88867 2.23242C3.17068 0.854486 4.97665 3.74942e-05 6.99805 0ZM6.99902 4.33008C6.172 4.33008 5.43592 4.70518 4.94531 5.30176L4.94629 5.30273L4.94434 5.30469C4.58274 5.75821 4.32526 6.39273 4.3252 7.02832C4.3252 8.50589 5.51262 9.71182 6.99805 9.71191C7.72195 9.71191 8.37179 9.42378 8.85156 8.96094L9.04395 8.75488L9.05176 8.74512L9.0459 8.75098C9.43372 8.28367 9.67072 7.67449 9.67188 7.01367C9.67188 5.53606 8.48454 4.33008 6.99902 4.33008Z`,
        fillColor: getHex(poi.map.color, 500),
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: getHex(poi.map.color, 700),
        scale: 1,
        anchor: new google.maps.Point(7, 20),
      },
    });

    marker.addListener("click", async () => {
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

const handleDirections = () => {
  const places = searchBox?.getPlaces();
  if (!places || places.length === 0) {
    console.warn("Please search for a location first");
    return;
  }

  // Remove previous origin marker if it exists
  if (originMarker) {
    originMarker.setMap(null);
  }

  // Add new origin marker at the search location
  const originLocation = places[0].geometry?.location;
  if (originLocation) {
    originMarker = new (window as any).google.maps.Marker({
      position: originLocation,
      map,
      title: "Point de départ",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "white",
        fillOpacity: 1,
        strokeColor: "black",
        strokeWeight: 2,
        scale: 5,
      },
    });
  }

  const origin = places[0].formatted_address || places[0].name;
  initDirections(map, pois, origin, maxHours.value);
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
  displayPois(pois);
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
  searchBox = initSearch(map);

  // Load and display POIs
  refreshPois();
});
</script>
