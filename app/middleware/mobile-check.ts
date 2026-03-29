export default defineNuxtRouteMiddleware((to, from) => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    ) && window.matchMedia("(max-width: 768px)").matches;

  if (!isMobile) {
    return navigateTo("/install");
  }
});
