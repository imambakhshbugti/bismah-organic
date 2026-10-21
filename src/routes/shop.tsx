import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, SearchX } from 'lucide-react'

import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories, products, type CategoryId } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const sorts = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name A–Z',
} as const
type Sort = keyof typeof sorts

type ShopSearch = { category?: CategoryId; q?: string; sort?: Sort }

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: categories.some((c) => c.id === search.category)
      ? (search.category as CategoryId)
      : undefined,
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    sort: typeof search.sort === 'string' && search.sort in sorts ? (search.sort as Sort) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Shop all products — Bismah Organic' }] }),
  component: Shop,
})

function Shop() {
  const { category, q = '', sort = 'featured' } = Route.useSearch()
  const navigate = useNavigate({ from: '/shop' })
  const active = categories.find((c) => c.id === category)

  const term = q.trim().toLowerCase()
  const results = products
    .filter((p) => !category || p.category === category)
    .filter(
      (p) =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.ingredients.toLowerCase().includes(term),
    )
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name') return a.name.localeCompare(b.name)
      return Number(!!b.bestseller) - Number(!!a.bestseller)
    })

  const update = (next: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }), replace: true, resetScroll: false })

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">The shop</p>
        <h1 className="mt-1 text-4xl font-semibold md:text-5xl">{active ? active.name : 'All products'}</h1>
        <p className="mt-3 max-w-reading text-muted-foreground">
          {active
            ? active.blurb
            : 'Organic and herbal skincare, hair oils and herbal remedies — all natural, all in one place.'}
        </p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 mb-8 space-y-4 border-b bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <FilterChip active={!category} onClick={() => update({ category: undefined })}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={category === c.id} onClick={() => update({ category: c.id })}>
              {c.name}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value || undefined })}
              placeholder="Search honey, rosemary, soap…"
              aria-label="Search products"
              className="rounded-full bg-card pl-9"
            />
          </div>
          <Select value={sort} onValueChange={(v) => update({ sort: v === 'featured' ? undefined : (v as Sort) })}>
            <SelectTrigger className="rounded-full bg-card sm:w-52" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sorts).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {results.length} product{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="font-medium">No products match “{q}”</p>
          <Button variant="outline" className="rounded-full" onClick={() => update({ q: undefined, category: undefined })}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}
