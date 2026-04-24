import { computed } from "vue";
import FramacarteRepository from "~/repositories/FramacarteRepository";

export const iconUrls = {
  assosiations: "/icons/family_home.svg",
  breeding: "/icons/rat.svg",
};

type LayerConfig = {
  label: string;
  id: string;
  color: string;
  icon: keyof typeof iconUrls;
};

export const layers = reactive(
  [] as (LayerConfig & {
    description: string;
    checked: boolean;
    markers: Awaited<ReturnType<FramacarteRepository["getMarkers"]>>;
  })[],
);

export async function initLayers() {
  if (layers.length) return;
  const configs = await $fetch<LayerConfig[]>("/api/layers");
  configs.forEach((c) =>
    layers.push({ ...c, description: "", checked: false, markers: [] }),
  );
}

export const checkedLayers = computed(() =>
  layers.filter((layer) => layer.checked),
);

export const markers = computed(() =>
  checkedLayers.value.flatMap((layer) =>
    layer.markers.map((m) => ({ ...m, color: layer.color, icon: layer.icon })),
  ),
);

async function setMarker(layer: (typeof layers)[number]) {
  if (layer.markers.length) return;
  layer.markers = await new FramacarteRepository().getMarkers(layer.id);
}

export async function setMarkers() {
  await Promise.all(checkedLayers.value.map(setMarker));
}
