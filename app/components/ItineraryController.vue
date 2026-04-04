<script setup lang="ts">
import SearchModal from "~/components/modals/searchModal.vue";
import DurationSlider from "~/components/durationSlider.vue";
import app from "~/stores/app";
import { it } from "@nuxt/ui/runtime/locale/index.js";
const itinerary = app.itinerary;
</script>

<template>
  <div class="w-full space-y-5">
    <div class="flex items-center w-full gap-2">

      <UIcon
        name="material-symbols:my-location-outline-rounded"
        class="shrink-0 w-5 h-5"
      />

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
    </div>

    <div class="flex items-center w-full gap-2">

     <UIcon
        name="lucide:clock"
        class="shrink-0 w-4.5 h-4.5 pl-5 d-block"
      />

        <DurationSlider
          v-model="itinerary.limits.hours"
          @change="$emit('set-routes')"
          class="px-1"
        />
    </div>
  </div>

</template>
