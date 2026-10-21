import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, HandHeart, Leaf, ShieldCheck, Wallet } from 'lucide-react'

import { ProductCard } from '@/components/product-card'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Button } from '@/components/ui/button'
import {
  categories,
  imageUrl,
  products,
  store,
  whatsappLink,
} from '@/lib/catalog'

export const Route = createFileRoute('/')({
  component: Home,
})

const promises = [
  {
    icon: Leaf,
    title: '100% natural',
    text: 'No parabens, fillers, colours or preservatives.',
  },
  {
    icon: HandHeart,
    title: 'Small batches',
    text: 'Made by hand and packed fresh every week.',
  },
  {
    icon: ShieldCheck,
    title: 'Honestly sourced',
    text: 'Direct from trusted farmers and growers.',
  },
  {
    icon: Wallet,
    title: 'Pay via JazzCash',
    text: 'Advance payment before dispatch. No cash on delivery.',
  },
]

const steps = [
  {
    title: 'Fill your bag',
    text: 'Browse the catalog and add the products you love.',
  },
  {
    title: 'Send on WhatsApp',
    text: 'Your order list is written for you — just tap send.',
  },
  {
    title: 'Confirm & receive',
    text: 'Pay via JazzCash, and we ship within a day of payment.',
  },
]

function Home() {
  // Bestsellers first, then the rest of the catalog.
  const featured = [...products].sort(
    (a, b) => Number(!!b.bestseller) - Number(!!a.bestseller),
  )

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={imageUrl('/img/hero.jpg', 1600)}
          alt="Amber bottles of herbal oil, raw honey, handmade soaps, herbs and dates on a wooden table"
          className="absolute inset-0 -z-10 size-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/10" />
        <div className="mx-auto max-w-content px-4 py-24 sm:px-6 md:py-36">
          <div className="max-w-xl text-primary-foreground">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-sm backdrop-blur">
              <Leaf className="size-4" /> Pure · Natural · Handmade
            </p>
            <h1 className="text-5xl leading-[1.05] font-semibold md:text-7xl">
              Bismah Organic
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/90 md:text-xl">
              Pure organic and herbal products — order on WhatsApp. Skincare,
              hair oils and herbal remedies, made in small batches with nothing
              to hide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/shop">
                  Shop the collection <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a
                  href={whatsappLink(
                    `Assalam-o-Alaikum ${store.name}! I have a question.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="size-5" /> Chat with us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section aria-label="Our promise" className="border-b bg-secondary/60">
        <ul className="mx-auto grid max-w-content gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              Collections
            </p>
            <h2 className="mt-1 text-3xl font-semibold md:text-4xl">
              Everything natural, in one place
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all products <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className={`group relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl p-5 text-primary-foreground ${
                i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
              }`}
            >
              <img
                src={imageUrl(c.image, 900)}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <h3 className="text-2xl font-semibold">{c.name}</h3>
              <p className="mt-1 max-w-xs text-sm text-primary-foreground/85">
                {c.blurb}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                Shop now{' '}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          Handmade in small batches
        </p>
        <h2 className="mt-1 mb-8 text-3xl font-semibold md:text-4xl">
          Our products
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 8).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* How to order */}
      <section
        id="how-to-order"
        className="mx-auto mt-16 max-w-content scroll-mt-20 px-4 sm:px-6"
      >
        <div className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary-foreground/70 uppercase">
                How to order
              </p>
              <h2 className="mt-1 text-3xl font-semibold md:text-4xl">
                Ordering is as easy as sending a message
              </h2>
              <p className="mt-4 text-primary-foreground/85">
                No accounts, no card payments. Build your order here and send it
                to us on WhatsApp — or use our order form if you prefer.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-whatsapp text-white hover:bg-whatsapp/90"
              >
                <Link to="/shop">
                  <WhatsAppIcon className="size-5" /> Start your order
                </Link>
              </Button>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="rounded-2xl bg-primary-foreground/10 p-5"
                >
                  <span className="font-display text-4xl font-semibold text-accent">
                    {i + 1}
                  </span>
                  <p className="mt-2 font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
