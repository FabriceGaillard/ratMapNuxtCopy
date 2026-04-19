const appConfig = useAppConfig();

type ThemeName = "default" | "celine";

const currentTheme = ref<ThemeName>("default");

const themes: Record<ThemeName, { primary: string; neutral: string }> = {
  default: { primary: "brand", neutral: "slate" },
  celine: { primary: "pale-pink", neutral: "olive" },
};

function setTheme(name: ThemeName) {
  currentTheme.value = name;
  const theme = themes[name];
  appConfig.ui.colors.primary = theme.primary;
  appConfig.ui.colors.neutral = theme.neutral;
  localStorage.setItem("theme", name);
}

export function useTheme() {
  onMounted(() => {
    const saved = localStorage.getItem("theme") as ThemeName | null;
    if (saved && themes[saved]) {
      setTheme(saved);
    }
  });

  return { currentTheme, setTheme };
}
