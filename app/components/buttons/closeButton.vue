<template>
  <UButton
    color="neutral"
    variant="soft"
    icon="material-symbols:close-rounded"
    @click="$emit('close')"
    size="sm"
    class="ml-auto rounded-full"
    @pointerdown.stop
    @touchstart.stop
  />
</template>
