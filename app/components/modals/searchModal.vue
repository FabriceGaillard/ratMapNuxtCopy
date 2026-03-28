<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useNuxtApp } from "#app";
import { DialogTitle, DialogDescription, Viewport } from "reka-ui";

const { $placesLibrary } = useNuxtApp();

const props = defineProps<{ formattedAddress: string; placeholder: string }>();

const emit = defineEmits<{
  select: (place: any) => void;
  "update:modelValue": (value: string) => void;
}>();

const predictions = ref([]);

const value = ref(props.formattedAddress);

const autocompleteService = new $placesLibrary.AutocompleteService();

const input = useTemplateRef("input");
const open = ref(false);

async function selectPrediction(prediction) {
  const place = new $placesLibrary.Place({ id: prediction.place_id });
  await place.fetchFields({
    fields: ["formattedAddress", "location", "viewport", "id"],
  });

  emit("select", {
    formattedAddress: place.formattedAddress,
    viewport: place.viewport,
    id: place.id,
    location: {
      lat: place.location.lat(),
      lng: place.location.lng(),
    },
  });

  predictions.value = [];
  open.value = false;
}

watch(
  () => open.value,
  (isOpened) => {
    if (isOpened) nextTick(() => input.value?.inputRef?.focus());
  },
);

watch(
  () => props.formattedAddress,
  () => (value.value = props.formattedAddress),
);

async function handleInput(value: string) {
  autocompleteService.getPlacePredictions({ input: value }, (preds) => {
    predictions.value = preds ?? [];
  });
}
</script>

<template>
  <UModal
    fullscreen
    v-model:open="open"
    :ui="{
      content:
        'z-10 data-[state=open]:animate-[fade-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
    }"
  >
    <slot></slot>
    <template #content>
      <DialogTitle class="sr-only">Itinéraires</DialogTitle>
      <DialogDescription class="sr-only"
        >Itinéraires disponibles pour ce lieu</DialogDescription
      >
      <div class="h-full">
        <div class="bg-muted p-4 pb-0 space-y-2">
          <div class="relative">
            <UFieldGroup class="w-full border border-muted rounded-full">
              <UButton
                icon="material-symbols:arrow-left-alt-rounded"
                size="xl"
                variant="link"
                color="neutral"
                @click="open = false"
                :ui="{
                  base: 'bg-white dark:bg-gray-900 rounded-full',
                }"
              />
              <UInput
                ref="input"
                type="text"
                :placeholder="placeholder"
                size="xl"
                class="w-full"
                v-model="value"
                @update:model-value="handleInput"
                @keydown.enter="
                  predictions.length && selectPrediction(predictions[0])
                "
                :ui="{
                  base: 'rounded-full !border-0 !ring-0 focus:!ring-0 pl-0',
                }"
              />
            </UFieldGroup>
          </div>

          <div>
            <UButton
              :avatar="{
                icon: 'material-symbols:my-location-rounded',
                size: 'md',
              }"
              label="Votre position"
              variant="ghost"
              color="neutral"
              class="w-full p-2 px-0 rounded-none"
              size="lg"
            />

            <USeparator />

            <UButton
              :avatar="{ icon: 'material-symbols:location-on', size: 'md' }"
              label="Sélectionner sur la carte"
              variant="ghost"
              color="neutral"
              class="w-full p-2 px-0 rounded-none""
              size="lg"
            />
          </div>
        </div>

        <UPageList
          v-if="predictions.length"
          class="bg-muted p-4 mt-2 py-0"
          divide
        >
          <UPageCard
            v-for="prediction in predictions"
            :key="prediction.place_id"
            variant="ghost"
            :ui="{
              body: 'w-full',
              container: '!p-0 !w-full',
            }"
          >
            <template #body>
              <UButton
                :avatar="{ icon: 'material-symbols:location-on', size: 'md' }"
                :label="prediction.description"
                color="neutral"
                variant="ghost"
                class="w-full p-2 px-0 rounded-none""
                @click="selectPrediction(prediction)"
              />
            </template>
          </UPageCard>
        </UPageList>
      </div>
    </template>
  </UModal>
</template>
