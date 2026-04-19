<script setup lang="ts">
import ListButton from "~/components/buttons/listButton.vue";
import { DialogTitle, DialogDescription } from "reka-ui";
import { layers } from "~/stores/framacarte";
import app from "~/stores/app";
import CloseButton from "../buttons/closeButton.vue";
import { colorMap } from "~/utils/colors";
import { fetchIcons } from "~/helpers/fetch";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const icons = ref<Record<string, SVGElement | null>>({});

onMounted(async () => {
  const { assosiations, breeding } = await fetchIcons();
  icons.value = {
    assosiations,
    breeding,
  };
});

watch(
  () => props.open,
  (v) => (app.listsDrawerOpen = v),
);

const getLayerIcon = (layer: any) => {
  return icons.value[layer.icon] || null;
};
</script>

<template>
  <UDrawer
    :handle="false"
    :modal="false"
    :dismissible="false"
    :open="open"
    direction="bottom"
    @update:open="emit('update:open', $event)"
    :ui="{
      content: 'w-screen max-h-none  min-h-[130px]',
    }"
  >
    <ListButton @click="emit('update:open', true)" />

    <template #content>
      <div class="flex items-center gap-2 w-full px-3 pt-5 pb-3">
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

        <CloseButton @click="emit('update:open', false)" />
      </div>
      <UPageList divide class="bg-muted p-0 pb-3">
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
                  class="w-5.5 h-5.5 rounded-full bg-elevated flex items-center justify-center shadow-md"
                >
                  <div
                    :class="`w-4.5 h-4.5 rounded-full ${colorMap[layer.color] || 'bg-neutral-600'} text-inverted flex items-center justify-center`"
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
          </template>
        </UPageCard>
      </UPageList>
    </template>
  </UDrawer>
</template>
