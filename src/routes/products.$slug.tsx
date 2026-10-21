import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { ProductCard } from '@/components/product-card'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Button } from '@/components/ui/button'
import {
  formatPrice,
  getCategory,
  getProduct,
  imageUrl,
  productImage,
  products,
  store,
  whatsappLink,
} from '@/lib/catalog'
import { useOrder } from '@/lib/order'

export const Route = createFileRoute('/products/$slug')({
  loader: ({ params }) => {
    const product = getProduct(params.slug)
    if (!product) throw notFound()
    return { product }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Bismah Organic` },
          { name: 'description', content: loaderData.product.description },
        ]
      : [],
  }),
  component: ProductPage,
})

function ProductPage() {
  const { product } = Route.useLoaderData()
  const category = getCategory(product.category)
  const { add, setOpen } = useOrder()
  const [quantity, setQuantity] = useState(1)
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  const quickOrder = `Assalam-o-Alaikum ${store.name}! I'd like to order:\n\n• ${product.name} (${product.size}) × ${quantity} — ${formatPrice(product.price * quantity)}\n\nName:\nDelivery address:\nCity:`

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <Link
        to="/shop"
        search={{ category: product.category }}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {category.name}
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-muted">
          <img
            src={imageUrl(productImage(product), 1000)}
            alt={`${category.name} by Bismah Organic`}
            className="aspect-square size-full object-cover"
          />
          {product.bestseller && (
            <span className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              Bestseller
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">{category.name}</p>
          <h1 className="mt-1 text-4xl font-semibold md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.size}</p>
          <p className="mt-6 text-3xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed">{product.description}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus />
              </Button>
              <span className="w-10 text-center tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 rounded-full"
              onClick={() => {
                add(product.slug, quantity)
                toast.success(`${quantity} × ${product.name} added to your order`, {
                  action: { label: 'View order', onClick: () => setOpen(true) },
                })
              }}
            >
              <ShoppingBag /> Add to order
            </Button>
          </div>
          <Button asChild size="lg" className="mt-3 rounded-full bg-whatsapp text-white hover:bg-whatsapp/90">
            <a href={whatsappLink(quickOrder)} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-5" /> Order this now on WhatsApp
            </a>
          </Button>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4" /> {store.deliveryNote}
          </p>

          <div className="mt-8 rounded-2xl border bg-card p-5">
            <h2 className="font-sans text-sm font-semibold">Ingredients</h2>
            <p className="mt-1 text-sm text-muted-foreground">{product.ingredients}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-3xl font-semibold">More from {category.name}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
