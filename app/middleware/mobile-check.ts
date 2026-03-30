export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    return;
  }

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    ) && window.matchMedia("(max-width: 768px)").matches;

  console.log({ isMobile });

  if (!isMobile) {
    return navigateTo("/install");
  }
});
