const PUBLIC_ROUTES = ["/login", "/install"];

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.includes(to.path)) return;

  const { loggedIn, fetch: fetchSession } = useUserSession();

  // Récupère la session une seule fois par cycle de vie de l'app
  const sessionInitialized = useState("session-initialized", () => false);
  if (!sessionInitialized.value) {
    await fetchSession();
    sessionInitialized.value = true;
  }

  if (!loggedIn.value) {
    return navigateTo("/login");
  }
});
