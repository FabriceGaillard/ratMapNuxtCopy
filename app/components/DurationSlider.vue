<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const displayHours = computed(() => {
  const h = Math.floor(props.modelValue);
  const m = Math.round((props.modelValue - h) * 60);

  return `${h}h ${m ? m + "min" : ""}`;
});
</script>
<template>
  <USlider
    :model-value="modelValue"
    :min="1"
    :max="15"
    :step="1 / 12"
    class="w-full"
    color="gray"
    :tooltip="{
      open: true,
      text: displayHours,
    }"
    size="xl"
    @pointerdown.stop.prevent
    @touchstart.stop.prevent
    @update:model-value="$emit('update:modelValue', $event!)"
  />
</template>
