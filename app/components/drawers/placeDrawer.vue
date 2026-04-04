<script setup lang="ts">
import { DialogTitle, DialogDescription } from "reka-ui";
import CloseButton from "../buttons/closeButton.vue";

defineProps<{
  place: google.maps.places.PlaceResult;
}>();
</script>

<template>
  <UDrawer :modal="false" :dismissible="false" direction="bottom" :ui="{
    content:'!d-block p-3 pt-3 '
  }">
    <template #content>
      <div class="flex items-center gap-2 w-full pb-1">
        <DialogTitle class="text-xl font-semibold">
          {{ place ? place.formattedAddress : "Points d'intérets" }}
        </DialogTitle>

        <DialogDescription class="sr-only">
          {{ "Listes disponibles pour ce lieu" }}
        </DialogDescription>

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
