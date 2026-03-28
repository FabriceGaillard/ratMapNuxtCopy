<script setup lang="ts">
import { ref } from "vue";
import ItineraryButton from "~/components/buttons/itineraryButton.vue";
import { DialogTitle, DialogDescription } from "reka-ui";
import ItineraryController from "~/components/ItineraryController.vue";

const open = ref(false);
</script>

<template>
  <UModal
    fullscreen
    v-model:open="open"
    :ui="{
      content:
        'z-10 data-[state=open]:animate-[fade-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]',
    }"
  >
    <ItineraryButton @click="open = true" />
    <template #content>
      <DialogTitle class="sr-only"> Itinéraires </DialogTitle>

      <DialogDescription class="sr-only">
        Itinéraires disponibles pour ce lieu
      </DialogDescription>
      <div class="flex flex-col h-full gap-2">
        <div class="flex w-full items-start gap-2 bg-muted p-4 py-6">
          <UButton
            icon="material-symbols:arrow-left-alt-rounded"
            size="xl"
            variant="link"
            color="neutral"
            @click="open = false"
            :ui="{
              base: 'rounded-full p-1 px-2',
            }"
          />
          <div class="grow space-y-3 mr-12">
            <ItineraryController
              :place="null"
              @select="
                {
                  $emit('select', $event);
                  open = false;
                }
              "
            />
          </div>
        </div>
        <!-- <div class="overflow-y-auto grow">
          <p v-if="routes.length === 0" class="text-sm text-slate-500">
            Aucun itinéraire trouvé pour cette recherche.
          </p>

          <template v-else>
            <div
              v-for="(route, index) in routes"
              :key="index"
              class="border-b border-gray-300 py-3"
            >
              <UBadge size="xs" color="neutral" variant="soft">
                {{ route.layer.label }}
              </UBadge>
              <div class="flex items-center min-w-0">
                <div class="text-md font-semibold truncate">
                  {{ route.marker.properties?.name }}
                </div>

                <UBadge
                  variant="soft"
                  size="md"
                  color="neutral"
                  class="ml-auto font-bold shrink-0"
                >
                  {{ formatDuration(route.seconds) }}
                </UBadge>
              </div>
              <p class="text-sm text-slate-500">
                {{ route.formated_address }}
              </p>
            </div>
          </template>
        </div> -->
      </div>
    </template>
  </UModal>
</template>
