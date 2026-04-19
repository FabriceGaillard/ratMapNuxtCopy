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

const activeSnapPoint = ref<string | number | null>(null);

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
    :handle="false"
    :modal="false"
    :dismissible="false"
    direction="bottom"
    :ui="{
      content: '!d-block p-3 pt-5  min-h-[130px]',
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
          class="text-muted text-sm whitespace-pre-wrap py-2 pr-2 max-h-[25vh] overflow-auto w-full"
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
