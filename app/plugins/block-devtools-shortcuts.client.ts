const DEVTOOLS_KEY_CODES = new Set(['KeyI', 'KeyJ', 'KeyC'])

function isDevtoolsShortcut(event: KeyboardEvent) {
  if (event.code === 'F12' || event.key === 'F12') return true
  const modifier = event.ctrlKey || event.metaKey
  if (!modifier) return false
  if ((event.shiftKey || event.altKey) && DEVTOOLS_KEY_CODES.has(event.code)) return true
  if (event.code === 'KeyU' && !event.shiftKey && !event.altKey) return true
  return false
}

export default defineNuxtPlugin(() => {
  window.addEventListener(
    'keydown',
    (event) => {
      if (!isDevtoolsShortcut(event)) return
      event.preventDefault()
      event.stopPropagation()
    },
    { capture: true },
  )
})
