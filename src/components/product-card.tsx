import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { formatPrice, getCategory, imageUrl, productImage, type Product } from '@/lib/catalog'
import { useOrder } from '@/lib/order'

export function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useOrder()
  const category = getCategory(product.category)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md motion-reduce:transition-none">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={imageUrl(productImage(product), 600)}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        {product.bestseller && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            Bestseller
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {category.name}
        </p>
        <h3 className="text-lg leading-snug font-semibold">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{product.size}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              add(product.slug)
              toast.success(`${product.name} added to your order`, {
                action: { label: 'View order', onClick: () => setOpen(true) },
              })
            }}
          >
            <Plus /> Add
          </Button>
        </div>
      </div>
    </article>
  )
}
