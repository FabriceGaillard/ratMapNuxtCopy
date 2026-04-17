<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
  change: [];
}>();

const displayHours = computed(() => {
  const h = Math.floor(props.modelValue);
  const m = Math.round((props.modelValue - h) * 60);
  return `${h}h${m ? " " + m + "min" : ""}`;
});

// contrôle du tooltip avec delay
const open = ref(false);
let closeTimeout: number | undefined;

// ouverture immédiate
const showTooltip = () => {
  if (closeTimeout) clearTimeout(closeTimeout);
  open.value = true;
};

// fermeture avec delay (ex: 500ms)
const hideTooltip = () => {
  closeTimeout = window.setTimeout(() => {
    open.value = false;
  }, 500);
};
</script>

<template>
  <div class="relative w-full">
    <USlider
      :model-value="modelValue"
      :min="1"
      :max="15"
      :step="1 / 12"
      class="w-full"
      color="gray"
      size="xl"
      :tooltip="{
        open: open,
        content: {
          side: 'bottom',
          updatePositionStrategy: 'always',
          class: 'z-50',
        },
        text: displayHours,
      }"
      @focus="showTooltip"
      @blur="hideTooltip"
      @pointerdown.stop.prevent="showTooltip"
      @pointerup.stop.prevent="
        () => {
          hideTooltip();
          emit('change');
        }
      "
      @touchstart.stop.prevent="showTooltip"
      @touchend.stop.prevent="
        () => {
          hideTooltip();
          emit('change');
        }
      "
      @update:model-value="$emit('update:modelValue', $event!)"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    />
  </div>
</template>
