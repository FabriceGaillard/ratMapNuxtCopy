<script setup lang="ts">
import SearchModal from "~/components/modals/searchModal.vue";
import DurationSlider from "~/components/durationSlider.vue";
import app from "~/stores/app";
import { it } from "@nuxt/ui/runtime/locale/index.js";
const itinerary = app.itinerary;
</script>

<template>
  <div class="flex w-full gap-2">
    <div class="flex flex-col">
      <UIcon
        name="material-symbols:my-location-outline-rounded"
        class="shrink-0 w-5 h-5 m-2"
      />
      <USeparator orientation="vertical" class="h-4 border-red-500" size="sm" />
      <UIcon
        name="material-symbols:timer-outline-rounded"
        class="shrink-0 w-5 h-5 m-2"
      />
    </div>

    <div class="grow min-w-0">
      <SearchModal
        :formattedAddress="app.place?.formattedAddress"
        placeholder="Choisir un lieu de départ"
        @select="$emit('select', $event)"
      >
        <UButton
          :label="
            app.place?.formattedAddress?.trim() || 'Choisir un lieu de départ'
          "
          variant="outline"
          color="neutral"
          class="w-full overflow-hidden text-ellipsis whitespace-nowrap"
          size="lg"
          @pointerdown.stop
          @touchstart.stop
        />
      </SearchModal>
      <!-- <USeparator class="h-4 p-1" /> -->
      <div class="h-4"></div>

      <div class="p-3">
        <DurationSlider
          v-model="itinerary.limits.hours"
          @change="$emit('set-routes')"
        />
      </div>
    </div>
  </div>
</template>
