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

const open = ref(false);
</script>
<template>
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
    @focus="open = true"
    @blur="open = false"
    @pointerdown.stop.prevent="open = true"
    @touchstart.stop.prevent="open = true"
    @touchend.stop.prevent="open = false"
    @pointerup.stop.prevent="open = false"
    @update:model-value="$emit('update:modelValue', $event!)"
  />
</template>
