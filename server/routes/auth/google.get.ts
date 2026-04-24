export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email"],
  },
  async onSuccess(event, { user }) {
    const config = useRuntimeConfig(event)
    const allowedEmails = (config.allowedEmails as string)
      .split(",")
      .map((e) => e.trim().toLowerCase())

    if (!allowedEmails.includes(user.email.toLowerCase())) {
      return sendRedirect(event, "/login?error=unauthorized")
    }

    await setUserSession(event, {
      user: {
        email: user.email,
      },
    })
    return sendRedirect(event, "/")
  },
  onError(event, error) {
    console.error("Google OAuth error:", error)
    return sendRedirect(event, "/login?error=oauth_failed")
  },
})
