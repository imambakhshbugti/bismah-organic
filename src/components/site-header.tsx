import { Link } from '@tanstack/react-router'
import { Menu, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { categories, imageUrl, store } from '@/lib/catalog'
import { useOrder } from '@/lib/order'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-md">
      <img
        src={imageUrl('/img/logo-mark.png', 96)}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full border border-border bg-card object-contain"
      />
      <span className="font-display text-xl font-semibold tracking-tight">
        {store.name}
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const { count, setOpen } = useOrder()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          <Link
            to="/shop"
            className="hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Shop all
          </Link>
          {categories.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
          <a href="/#how-to-order" className="hover:text-primary">
            How to order
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="relative rounded-full"
            onClick={() => setOpen(true)}
            aria-label={`Open order bag, ${count} item${count === 1 ? '' : 's'}`}
          >
            <ShoppingBag />
            <span className="hidden sm:inline">My order</span>
            {count > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Browse</SheetTitle>
                <SheetDescription>
                  Shop our organic collections.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 px-4 text-base"
              >
                <Link
                  to="/shop"
                  className="rounded-md px-2 py-2 hover:bg-muted"
                >
                  Shop all
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to="/shop"
                    search={{ category: c.id }}
                    className="rounded-md px-2 py-2 hover:bg-muted"
                  >
                    {c.name}
                  </Link>
                ))}
                <a
                  href="/#how-to-order"
                  className="rounded-md px-2 py-2 hover:bg-muted"
                >
                  How to order
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
