<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import CloseButton from "../buttons/closeButton.vue";
import { parseLinksInText } from "~/helpers/string";
import app from "~/stores/app";

const props = defineProps<{
  place:
    | (google.maps.places.PlaceResult & {
        marker: Record<string, unknown>;
      })
    | null;
  loadingRoutes?: boolean;
}>();
</script>

<template>
  <UDrawer
    :handle="false"
    :modal="false"
    :dismissible="false"
    direction="bottom"
    :ui="{
      content: '!d-block p-3 pt-3 ',
    }"
  >
    <template #content>
      <div class="flex items-start gap-2 w-full pb-1 relative">
        <CloseButton
          @click="$emit('close-drawer')"
          class="absolute top-0 right-0"
        />
        <template v-if="place?.marker">
          <div class="w-full">
            <DialogTitle class="text-xl font-semibold">
              {{ place.marker.properties.name }}
            </DialogTitle>
            <div class="">{{ place.formattedAddress }}</div>
            <DialogDescription
              class="text-muted text-sm whitespace-pre-wrap py-2 pr-2 max-h-[25vh] overflow-auto w-full"
              v-html="parseLinksInText(place.marker.properties.description)"
            />
          </div>
        </template>
        <template v-else>
          <DialogTitle class="text-xl font-semibold">
            {{ place ? place.formattedAddress : "Points d'intérets" }}
          </DialogTitle>

          <DialogDescription class="sr-only">
            {{ "Listes disponibles pour ce lieu" }}
          </DialogDescription>
        </template>
      </div>
      <div>
        <UButton
          v-if="app.mode !== 'itinerary'"
          icon="material-symbols:directions-rounded"
          label="itinéraire"
          @click="$emit('select')"
          class="text-normal font-normal"
          :loading="loadingRoutes"
          loading-icon="material-symbols:progress-activity"
        />
      </div>
    </template>
  </UDrawer>
</template>
