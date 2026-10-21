import { Minus, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatPrice, imageUrl, productImage } from '@/lib/catalog'
import { useOrder } from '@/lib/order'

export function OrderLines() {
  const { lines, setQuantity, remove } = useOrder()

  return (
    <ul className="divide-y">
      {lines.map(({ product, quantity }) => (
        <li key={product.slug} className="flex gap-3 py-4">
          <img
            src={imageUrl(productImage(product), 160)}
            alt=""
            className="size-16 shrink-0 rounded-lg object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.size} · {formatPrice(product.price)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(product.slug)}
                aria-label={`Remove ${product.name}`}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center rounded-full border">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setQuantity(product.slug, quantity - 1)}
                  aria-label={`Decrease ${product.name} quantity`}
                >
                  <Minus />
                </Button>
                <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setQuantity(product.slug, quantity + 1)}
                  aria-label={`Increase ${product.name} quantity`}
                >
                  <Plus />
                </Button>
              </div>
              <span className="text-sm font-semibold">{formatPrice(product.price * quantity)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
