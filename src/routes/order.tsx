import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { OrderLines } from '@/components/order-lines'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, store, whatsappLink } from '@/lib/catalog'
import { orderSummary, useOrder, whatsappOrderMessage } from '@/lib/order'

export const Route = createFileRoute('/order')({
  head: () => ({ meta: [{ title: 'Place your order — Bismah Organic' }] }),
  component: OrderPage,
})

type State = 'idle' | 'pending' | 'success' | 'error'

function OrderPage() {
  const { lines, total, ready, clear } = useOrder()
  const [state, setState] = useState<State>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const body = new URLSearchParams()
    new FormData(event.currentTarget).forEach((value, key) => body.append(key, String(value)))
    setState('pending')
    try {
      const response = await fetch('/order-form.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Submission failed')
      // A plain preview server returns the unprocessed registration file instead of handling the post.
      if (/\bdata-netlify\s*=/i.test(await response.text())) throw new Error('Form handling unavailable')
      setState('success')
      clear()
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="mx-auto flex max-w-reading flex-col items-center px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="size-14 text-primary" />
        <h1 className="mt-4 text-4xl font-semibold">Thank you — order received!</h1>
        <p role="status" className="mt-3 text-muted-foreground">
          We’ll call or message you shortly to confirm your order and share JazzCash details. Your order is dispatched once payment is received.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <Skeleton className="h-12 w-72" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-reading flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <ShoppingBag className="size-6" />
        </span>
        <h1 className="mt-4 text-4xl font-semibold">Your order bag is empty</h1>
        <p className="mt-3 text-muted-foreground">Add products from the shop, then come back here to place your order.</p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link to="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-semibold md:text-5xl">Place your order</h1>
      <p className="mt-3 max-w-reading text-muted-foreground">
        Share your delivery details and we’ll confirm your order by phone. Payment is made in advance via JazzCash — no cash on delivery. Prefer chatting?{' '}
        <a
          href={whatsappLink(whatsappOrderMessage(lines, total))}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Send it on WhatsApp instead
        </a>
        .
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form
          name="order"
          method="POST"
          action="/order-form.html"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={submit}
          onChange={() => {
            if (state === 'error') setState('idle')
          }}
          className="rounded-2xl border bg-card p-6"
        >
          <input type="hidden" name="form-name" value="order" />
          <input type="hidden" name="order" value={orderSummary(lines, total)} />
          <input type="hidden" name="total" value={formatPrice(total)} />
          <p hidden>
            <label>
              Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <fieldset disabled={state === 'pending'} className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 font-display text-xl font-semibold">Delivery details</legend>
            <Field label="Full name" htmlFor="name">
              <Input id="name" name="name" autoComplete="name" required maxLength={100} />
            </Field>
            <Field label="Phone / WhatsApp" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder="03xx xxxxxxx" />
            </Field>
            <Field label="Email (optional)" htmlFor="email">
              <Input id="email" name="email" type="email" autoComplete="email" maxLength={254} />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" autoComplete="address-level2" required maxLength={80} />
            </Field>
            <Field label="Delivery address" htmlFor="address" className="sm:col-span-2">
              <Textarea id="address" name="address" autoComplete="street-address" required maxLength={500} rows={3} />
            </Field>
            <Field label="Notes (optional)" htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" name="notes" maxLength={1000} rows={2} placeholder="Preferred delivery time, gift note…" />
            </Field>
            <div className="sm:col-span-2">
              {state === 'error' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription role="alert">
                    Your order wasn’t sent. Your details are still here — please try again, or send
                    your order on WhatsApp.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" size="lg" className="w-full rounded-full">
                {state === 'pending' ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">{store.deliveryNote}</p>
            </div>
          </fieldset>
        </form>

        <aside className="h-fit rounded-2xl border bg-secondary/40 p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <OrderLines />
          <div className="flex items-baseline justify-between border-t pt-4">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-2xl font-semibold">{formatPrice(total)}</span>
          </div>
          <Button asChild variant="outline" className="mt-6 w-full rounded-full">
            <a href={whatsappLink(whatsappOrderMessage(lines, total))} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-4" /> Order on WhatsApp instead
            </a>
          </Button>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`grid gap-2 ${className ?? ''}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
