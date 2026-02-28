<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Vertical Slider -->
    <div class="fixed top-5 left-5 z-10">
      <USlider
        v-model="maxHours"
        :min="1"
        :max="15"
        :step="1"
        class="w-12"
      />
      <UBadge
        color="blue"
        variant="subtle"
      >
        {{ maxHours }}h
      </UBadge>
    </div>

    <!-- Search Container -->
    <div class="absolute top-2.5 left-20 z-5">
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
          icon="i-heroicons-map-20-solid"
          aria-label="Itinéraire"
          color="neutral"
          variant="subtle"
          @click="handleDirections"
        />
      </UFieldGroup>
    </div>
    <UDropdownMenu
      :items="items"
      class="fixed top-3 right-3 z-10"
    >
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="outline"
      />
    </UDropdownMenu>

    <!-- Map -->
    <div
      id="map"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePois } from '~/composables/usePois'
import { useSearch } from '~/composables/useSearch'
import { useDirections } from '~/composables/useDirections'
import { useGoogleMaps } from '~/composables/useGoogleMaps'

const { getPois } = usePois()
const { initSearch } = useSearch()
const { initDirections } = useDirections()
const { loadGoogleMaps } = useGoogleMaps()

const maxHours = ref(5)
const searchQuery = ref('')
let map: any = null
let searchBox: any = null
let pois: any[] = []
let markers: any[] = []

const maps = [
  {
    label: 'tops-assos',
    id: '221549',
    color: 'info',
    checked: ref(true),
    icon: 'material-symbols:location-on',
    type: 'checkbox' as const,
    onUpdateChecked(checked: boolean) {
      maps[0].checked.value = checked
      refreshPois()
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  },
  {
    label: 'mauvaises-assos',
    id: '221570',
    color: 'success',
    icon: 'material-symbols:location-on',
    checked: ref(false),
    type: 'checkbox' as const,
    onUpdateChecked(checked: boolean) {
      maps[1].checked.value = checked
      refreshPois()
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }
]

const items = ref([
  [
    {
      label: 'Points of Interest',
      type: 'label',

      icon: 'lucide:house-heart'
    }
  ],
  maps
])

const createMap = (): any => {
  const mapElement = document.getElementById('map')
  return new (window as any).google.maps.Map(mapElement, {
    zoom: 5,
    center: { lat: 46.5, lng: 2.5 },
    mapTypeControl: false,
    fullscreenControl: false
  })
}

const displayPois = (poisData: any[]) => {
  // Clear all previous markers
  markers.forEach(marker => marker.setMap(null))
  markers = []

  // Add new markers
  poisData.forEach((poi: any) => {
    const marker = new (window as any).google.maps.Marker({
      position: poi.position,
      map,
      title: poi.name,
      color: 'blue'
    })
    markers.push(marker)
  })
}

const handleDirections = () => {
  const places = searchBox?.getPlaces()
  if (!places || places.length === 0) {
    console.warn('Please search for a location first')
    return
  }

  const origin = places[0].formatted_address || places[0].name
  initDirections(map, pois, origin, maxHours.value)
}

async function refreshPois() {
  pois = await Promise.all(
    maps.filter(e => e.checked.value).map(map => getPois(map.id))
  ).then(results => results.flat())
  displayPois(pois)
}

onMounted(async () => {
  // Load Google Maps API
  await loadGoogleMaps()

  // Initialize map
  map = createMap()

  // Initialize search
  searchBox = initSearch(map)

  // Load and display POIs
  refreshPois()
})
</script>
