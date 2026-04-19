<script setup lang="ts">
const props = defineProps<{ disabled?: boolean }>();

const open = ref(false);

let closeTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => open.value,
  (v) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (v) {
      closeTimer = setTimeout(() => {
        open.value = false;
        closeTimer = null;
      }, 2000);
    }
  },
);

onUnmounted(() => {
  if (closeTimer) clearTimeout(closeTimer);
});
</script>

<template>
  <UPopover
    v-if="disabled"
    v-model:open="open"
    :content="{ side: 'left', sideOffset: 8, collisionPadding: 8 }"
    @click="open = !open"
  >
    <UButton
      class="w-10 h-10 rounded-xl p-2 text-neutral-500"
      :class="disabled ? 'opacity-70' : ''"
    >
      <UIcon name="material-symbols:directions-rounded" class="w-full h-full" />
    </UButton>
    <template #content>
      <UAlert
        variant="soft"
        color="neutral"
        title="Affichez d'abord des points d'intérets"
        class="py-2.5"
      />
    </template>
  </UPopover>
  <UButton v-else class="w-10 h-10 rounded-xl p-2 text-neutral-500">
    <UIcon name="material-symbols:directions-rounded" class="w-full h-full" />
  </UButton>
</template>
