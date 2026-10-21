import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

import { Logo } from '@/components/site-header'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { categories, store, whatsappLink } from '@/lib/catalog'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/50">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            {store.tagline}. Organic and herbal products only: skincare, hair oils and herbal
            remedies — sourced honestly and packed with care.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Shop</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to="/shop" search={{ category: c.id }} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold">Get in touch</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={whatsappLink(`Assalam-o-Alaikum ${store.name}!`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${store.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
                <Mail className="size-4" /> {store.email}
              </a>
            </li>
            <li>{store.deliveryNote}</li>
          </ul>
        </div>
      </div>
      <p className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {store.name}. Made with love, naturally.
      </p>
    </footer>
  )
}
