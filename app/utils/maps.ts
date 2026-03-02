import { ref } from "vue";

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
  const maps: MapItem[] = [
    {
      label: "Tops Assos",
      id: "221549",
      color: "info",
      checked: ref(true),
      icon: "material-symbols:location-on",
      type: "checkbox",
      onUpdateChecked(checked: boolean) {
        maps[0]!.checked.value = checked;
        refreshPois();
      },
      onSelect(e: Event) {
        e.preventDefault();
      },
    },
    {
      label: "Mauvaises Assos",
      id: "221570",
      color: "success",
      checked: ref(false),
      icon: "material-symbols:location-on",
      type: "checkbox",
      onUpdateChecked(checked: boolean) {
        maps[1]!.checked.value = checked;
        refreshPois();
      },
      onSelect(e: Event) {
        e.preventDefault();
      },
    },
  ];

  return maps;
}
