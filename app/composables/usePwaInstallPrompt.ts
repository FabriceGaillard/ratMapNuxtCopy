import { ref } from 'vue'

export const deferredPrompt = ref<BeforeInstallPromptEvent>()
export const status = ref<'installed' | 'pending' | 'unavailable' | 'readyToInstall' | 'accepted'>(
  'unavailable',
)

export function usePwaInstallPrompt() {
  return {
    deferredPrompt,
    status,
    triggerPrompt() {
      status.value = 'pending'
      deferredPrompt.value?.prompt()

      deferredPrompt.value!.userChoice.then((choice) => {
        if (choice.outcome !== 'accepted') {
          status.value = 'readyToInstall'
        } else {
          deferredPrompt.value = undefined
        }
      })
    },
  }
}
