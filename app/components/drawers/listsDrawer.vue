<script setup lang="ts">
import ListButton from "~/components/buttons/listButton.vue";
import { DialogTitle, DialogDescription } from "reka-ui";
import { layers } from "~/stores/framacarte";
import app from "~/stores/app";
import CloseButton from "../buttons/closeButton.vue";
import { colorMap } from "~/utils/colors";
import { fetchIcons } from "~/helpers/fetch";

const open = ref(false);
const icons = ref<Record<string, SVGElement | null>>({});

onMounted(async () => {
  const { assosiations, breeding } = await fetchIcons();
  icons.value = {
    assosiations,
    breeding,
  };
});

watch(
  () => open.value,
  (v) => (app.listsDrawerOpen = v),
);

const getLayerIcon = (layer: any) => {
  return icons.value[layer.icon] || null;
};
</script>

<template>
  <UDrawer
    :modal="false"
    :open="open"
    direction="bottom"
    :ui="{
      content: 'w-screen max-h-none',
    }"
    :snap-points="[0.4, 1]"
    @close="open = false"
  >
    <ListButton @click="open = true" />
    <template #content>
      <div class="flex items-center gap-2 w-full px-3 pt-3 pb-1">
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
              :label="layer.label"
              color="neutral"
              variant="ghost"
              class="w-full p-3 px-4 rounded-none"
              @click.stop="layer.checked = !layer.checked"
            >
              <template #leading>
                <div
                  class="w-[22px] h-[22px] rounded-full bg-elevated flex items-center justify-center shadow-md"
                >
                  <div
                    :class="`w-[18px] h-[18px] rounded-full ${colorMap[layer.color] || 'bg-gray-600'} text-inverted flex items-center justify-center`"
                  >
                    <div
                      v-if="getLayerIcon(layer)"
                      class="w-3 h-3"
                      v-html="getLayerIcon(layer)?.outerHTML"
                    />
                  </div>
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
