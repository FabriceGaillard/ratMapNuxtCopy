<script setup lang="ts">
import { layers } from "~/stores/framacarte";

const props = defineProps<{
  icon: SVGElement;
}>();

const filteredLayers = computed(() =>
  layers.filter((l) => l.icon === "assosiations"),
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
    :variant="allChecked ? 'solid' : 'soft'"
    color="neutral"
    @click="toggleLayers"
  >
    <div class="w-full h-full p-1 rounded-full bg-inverted">
      <div class="w-full h-full text-inverted" v-html="icon?.outerHTML" />
    </div>
  </UButton>
</template>
