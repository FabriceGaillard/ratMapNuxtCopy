<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const appConfig = useAppConfig();

type ThemeName = "default" | "celine";
const currentTheme = ref<ThemeName>("celine");

const themes: Record<ThemeName, { primary: string; neutral: string }> = {
  default: { primary: "brand", neutral: "slate" },
  celine: { primary: "pink", neutral: "olive" },
};

function setTheme(name: ThemeName) {
  currentTheme.value = name;
  const theme = themes[name];
  appConfig.ui.colors.primary = theme.primary;
  appConfig.ui.colors.neutral = theme.neutral;
}

const items = computed(
  () =>
    [
      {
        label: "Thèmes",
        icon: "material-symbols:colorize",
        type: "label" as const,
      },
      {
        type: "separator" as const,
      },
      {
        label: "Défaut",
        icon: "material-symbols:invert-colors-outline",
        type: "checkbox" as const,
        checked: currentTheme.value === "default",
        color: "brand",
        onSelect(e: Event) {
          e.preventDefault();
          setTheme("default");
        },
      },
      {
        label: "Céline",
        icon: "material-symbols:star-shine-rounded",
        type: "checkbox" as const,
        checked: currentTheme.value === "celine",
        color: "pink",
        onSelect(e: Event) {
          e.preventDefault();
          setTheme("celine");
        },
      },
    ] satisfies DropdownMenuItem[],
);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start', side: 'right' }"
    :ui="{ content: 'w-48' }"
  >
    <UButton class="w-10 h-10 rounded-xl p-2" variant="soft" color="neutral">
      <UIcon name="material-symbols:colors" class="w-full h-full" />
    </UButton>
  </UDropdownMenu>
</template>
