export const useMenuOpen = () => useState<boolean>('fg-menu', () => false)
export const useQuoteOpen = () => useState<boolean>('fg-quote', () => false)

export function useOpenQuote() {
  const q = useQuoteOpen(); const m = useMenuOpen()
  return () => { m.value = false; q.value = true }
}
