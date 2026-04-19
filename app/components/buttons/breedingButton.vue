<script setup lang="ts">
import { layers } from "~/stores/framacarte";

const props = defineProps<{
  icon: SVGElement;
}>();

const filteredLayers = computed(() =>
  layers.filter((l) => l.icon === "breeding"),
);

const allChecked = computed(() => filteredLayers.value.every((l) => l.checked));

function toggleLayers() {
  const shouldCheck = !allChecked.value;
  filteredLayers.value.forEach((l) => (l.checked = shouldCheck));
}
</script>

<template>
  <UButton
    class="w-10 h-10 rounded-xl p-2"
    variant="soft"
    :class="allChecked ? 'bg-neutral-600' : ''"
    color="neutral"
    @click="toggleLayers"
  >
    <div
      class="w-full h-full p-1 rounded-full bg-neutral-200 dark:bg-neutral-700"
    >
      <div class="w-full h-full" v-html="icon?.outerHTML" />
    </div>
  </UButton>
</template>
