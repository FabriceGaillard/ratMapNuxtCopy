<script setup lang="ts">
import ListButton from "~/components/buttons/listButton.vue";
import { DialogTitle, DialogDescription } from "reka-ui";
import { layers } from "~/stores/framacarte";
import app from "~/stores/app";
import { colorMap } from "~/utils/colors";
import CloseButton from "../buttons/closeButton.vue";

const open = ref(false);

watch(
  () => open.value,
  (v) => (app.listsDrawerOpen = v),
);
</script>

<template>
  <UDrawer
    :modal="false"
    :open="open"
    direction="bottom"
    fullscreen
    :ui="{
      header: 'sticky top-0 left-0 flex px-3 pt-3 pb-1',
      content: 'w-screen h-[45%] m-0',
      container: '!p-0',
    }"
    @close="open = false"
  >
    <ListButton @click="open = true" />
    <template #header>
      <div class="flex items-center gap-2 w-full">
        <UIcon
          name="material-symbols:location-on-outline-rounded"
          class="w-5 h-5 ml-1.5"
        />
        <DialogTitle class="text-xl font-semibold">
          {{ "Points d'intérets" }}
        </DialogTitle>

        <DialogDescription class="sr-only">
          {{ "Listes disponibles pour ce lieu" }}
        </DialogDescription>

        <CloseButton @click="open = false" />
      </div>
    </template>
    <template #body>
      <UPageList divide class="bg-muted p-4 p-0">
        <UPageCard
          v-for="layer in layers"
          :key="layer.id"
          variant="ghost"
          :ui="{
            body: 'w-full p-0',
            container: '!p-0 !w-full',
          }"
        >
          <template #body>
            <UButton
              :avatar="{ icon: 'material-symbols:location-on', size: 'md' }"
              :label="layer.label"
              color="neutral"
              variant="ghost"
              class="w-full p-3 px-4 rounded-none"
              @click.stop="layer.checked = !layer.checked"
              @pointerdown.stop
              @touchstart.stop
            >
              <template #leading>
                <div
                  class="bg-gray-200 flex items-center justify-center rounded-full w-6.5 h-6.5"
                >
                  <UIcon
                    name="material-symbols:location-on bg-gray-500"
                    class="p-0"
                    size="md"
                    :ui="{
                      base: `${colorMap[layer.color]}`,
                    }"
                  />
                </div>
              </template>
              <template #trailing>
                <USwitch
                  @click.stop
                  v-model="layer.checked"
                  size="sm"
                  class="ml-auto"
                  color="neutral"
                />
              </template>
            </UButton>

            <!-- <div>
              <div class="text-highlited">
                <UChip
                  standalone
                  inset
                  class="ml-auto"
                  size="xl"
                  :ui="{
                    base: `${colorMap[layer.color]}`,
                  }"
                />
                {{ layer.label }}
              </div>
            </div>

            <USwitch v-model="layer.checked" class="ml-auto" /> -->
          </template>
        </UPageCard>
      </UPageList>
    </template>
  </UDrawer>
</template>
