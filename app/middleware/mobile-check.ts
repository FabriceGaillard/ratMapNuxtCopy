export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    return;
  }

  const config = useRuntimeConfig();

  if (to.path === "/login") {
    return;
  }

  if (config.public.nodeEnv === "development") {
    return;
  }

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    ) && window.matchMedia("(max-width: 768px)").matches;

  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

  if (!isMobile || !isInstalled) {
    return navigateTo("/install");
  }
});
