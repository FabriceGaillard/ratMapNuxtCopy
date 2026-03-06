import { ref } from "vue";
import framacarteData from "~/data/framacarteData";

export type MapItem = {
  label: string;
  id: string;
  color: string;
  checked: ReturnType<typeof ref>;
  icon: string;
  type: "checkbox";
  onUpdateChecked: (checked: boolean) => void;
  onSelect: (e: Event) => void;
};

export function createMaps(refreshPois: () => void): MapItem[] {
  const maps: MapItem[] = framacarteData.map((mapData, index) => ({
    ...mapData,
    type: "checkbox" as const,
    onUpdateChecked(checked: boolean) {
      maps[index]!.checked.value = checked;
      refreshPois();
    },
    onSelect(e: Event) {
      e.preventDefault();
    },
  }));

  return maps;
}
