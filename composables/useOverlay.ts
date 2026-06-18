export const useMenuOpen = () => useState<boolean>('fg-menu', () => false)
export const useQuoteOpen = () => useState<boolean>('fg-quote', () => false)
// true while the first-load curtain or a page transition is covering the screen;
// page reveal choreography waits for it so nothing animates half-hidden
export const usePageHold = () => useState<boolean>('fg-hold', () => true)

export function useOpenQuote() {
  const q = useQuoteOpen(); const m = useMenuOpen()
  return () => { m.value = false; q.value = true }
}
