<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import CloseButton from "../buttons/closeButton.vue";

defineProps<{
  place: google.maps.places.PlaceResult & {
    marker: Record<string, unknown>
  };
}>();
</script>

<template>
  <UDrawer :modal="false" :dismissible="false" direction="bottom" :ui="{
    content:'!d-block p-3 pt-3 '
  }">
    <template #content>
      <div class="flex items-start gap-2 w-full pb-1">
        <template v-if="!place.marker">
          <DialogTitle class="text-xl font-semibold">
            {{ place ? place.formattedAddress : "Points d'intérets" }}
          </DialogTitle>

          <DialogDescription class="sr-only">
            {{ "Listes disponibles pour ce lieu" }}
          </DialogDescription>
        </template>
        <template v-else>
          <div>
            <DialogTitle class="text-xl font-semibold">
              {{ place.marker.properties.name }}
            </DialogTitle>
            <div class="">{{place.formattedAddress}}</div>
            <DialogDescription class="text-muted">
              {{ place.marker.properties.description }}
            </DialogDescription>
          </div>
        </template>

        <CloseButton @click="$emit('close-drawer')" />
      </div>
      <div>

      <UButton
        icon="material-symbols:directions-rounded"
        label="itinéraire"
        @click="$emit('select')"
        class="text-normal font-normal"
      />
      </div>
    </template>
  </UDrawer>
</template>
