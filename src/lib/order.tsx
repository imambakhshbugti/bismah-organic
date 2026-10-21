import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { formatPrice, getProduct, store, type Product } from '@/lib/catalog'

type OrderLine = { product: Product; quantity: number }

type OrderContextValue = {
  lines: OrderLine[]
  count: number
  total: number
  /** False until the saved bag has been read from localStorage. */
  ready: boolean
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (slug: string, quantity?: number) => void
  setQuantity: (slug: string, quantity: number) => void
  remove: (slug: string) => void
  clear: () => void
}

const STORAGE_KEY = 'bisma-order'
const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({})
  const [loaded, setLoaded] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // localStorage is only available in the browser, so read it after hydration.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
      if (saved && typeof saved === 'object') setItems(saved)
    } catch {
      // Ignore a corrupt saved bag.
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const add = useCallback((slug: string, quantity = 1) => {
    setItems((prev) => ({ ...prev, [slug]: Math.min(99, (prev[slug] ?? 0) + quantity) }))
  }, [])

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      const next = { ...prev }
      if (quantity <= 0) delete next[slug]
      else next[slug] = Math.min(99, quantity)
      return next
    })
  }, [])

  const remove = useCallback((slug: string) => setQuantity(slug, 0), [setQuantity])
  const clear = useCallback(() => setItems({}), [])

  const value = useMemo(() => {
    const lines = Object.entries(items).flatMap(([slug, quantity]) => {
      const product = getProduct(slug)
      return product && quantity > 0 ? [{ product, quantity }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      total: lines.reduce((n, l) => n + l.quantity * l.product.price, 0),
      ready: loaded,
      isOpen,
      setOpen,
      add,
      setQuantity,
      remove,
      clear,
    }
  }, [items, loaded, isOpen, add, setQuantity, remove, clear])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside OrderProvider')
  return ctx
}

/** Plain-text order summary used for the WhatsApp message and the order form. */
export function orderSummary(lines: OrderLine[], total: number) {
  return [
    ...lines.map(
      (l) =>
        `• ${l.product.name} (${l.product.size}) × ${l.quantity} — ${formatPrice(l.product.price * l.quantity)}`,
    ),
    `Total: ${formatPrice(total)}`,
  ].join('\n')
}

export function whatsappOrderMessage(lines: OrderLine[], total: number) {
  return `Assalam-o-Alaikum ${store.name}! I'd like to order:\n\n${orderSummary(lines, total)}\n\nName:\nDelivery address:\nCity:`
}
