<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import CloseButton from "../buttons/closeButton.vue";
import { parseLinksInText } from "~/helpers/string";
import { formatDuration } from "~/helpers/duration";
import { extractCityFromGeocodeResult } from "~/helpers/PlaceHelper";
import GoogleRouteRepository from "~/repositories/GoogleRouteRepository";

const props = defineProps<{
  route:
    | (Awaited<ReturnType<GoogleRouteRepository["computeRoute"]>> & {
        marker: Record<string, any>;
        layer: Record<string, any>;
      })
    | null;
}>();

const { $geocodingLibrary } = useNuxtApp();

const snapPoints = reactive<(string | number)[]>([]);
const activeSnapPoint = ref<string | number | null>(null);
const descriptionEl = ref<{ $el: HTMLElement } | null>(null);

onMounted(() => {
  snapPoints.push(...["230px", `${window.innerHeight - 150}px`, 1]);
});

function handleSnapPointUpdate(a: string | number) {
  activeSnapPoint.value = a;
}

function onDescriptionTouchStart(e: TouchEvent) {
  if (activeSnapPoint.value !== 1) return;
  const el = descriptionEl.value?.$el;
  if (el && el.scrollHeight > el.clientHeight) {
    e.stopPropagation();
  }
}

const city = ref("");

watch(
  () => props.route,
  async (route) => {
    if (!route?.destination) {
      city.value = "";
      return;
    }
    const geocoder = new ($geocodingLibrary as any).Geocoder();
    geocoder.geocode(
      { location: route.destination },
      (results: google.maps.GeocoderResult[], status: string) => {
        if (status === "OK" && results[0]) {
          city.value = extractCityFromGeocodeResult(results[0]);
        }
      },
    );
  },
  { immediate: true },
);

const km = computed(() => {
  if (!props.route?.meters) return null;
  const km = props.route.meters / 1000;
  return km < 1 ? `${props.route.meters} m` : `${km.toFixed(1)} km`;
});
</script>

<template>
  <UDrawer
    :modal="false"
    :dismissible="false"
    direction="bottom"
    :snapPoints="snapPoints"
    @update:activeSnapPoint="handleSnapPointUpdate"
    :ui="{
      content: 'max-h-none !d-block p-3 pt-3',
    }"
  >
    <template #content>
      <div class="relative w-full">
        <CloseButton @click="$emit('close')" class="absolute top-0 right-0" />

        <div class="pr-8">
          <DialogTitle class="text-xl font-semibold leading-tight">
            {{ route?.marker?.properties?.name }}
          </DialogTitle>
          <p v-if="city" class="text-sm text-dimmed mt-0.5">{{ city }}</p>
        </div>

        <div class="mt-3">
          <span class="text-success">
            {{ formatDuration(route?.seconds ?? 0) }}</span
          >
          <span class="font-normal ml-1">({{ km }})</span>
        </div>

        <USeparator class="my-3" />

        <DialogDescription
          ref="descriptionEl"
          class="text-sm text-muted whitespace-pre-wrap max-h-[30vh] overflow-auto"
          :class="
            activeSnapPoint === 1 ? 'overflow-y-auto' : 'overflow-y-hidden'
          "
          @touchstart="onDescriptionTouchStart"
          v-html="
            parseLinksInText(
              route?.marker?.properties.description ?? 'Aucune description',
            )
          "
        />
      </div>
    </template>
  </UDrawer>
</template>
