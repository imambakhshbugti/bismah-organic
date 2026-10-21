# Bismah Organic

The online catalog for **Bismah Organic** — skincare, herbal hair oils, herbal remedies, wholesome foods and pantry staples. Customers browse products, build an order bag, and send the finished order to the shop on **WhatsApp** with one tap. Customers who don't use WhatsApp can place the same order through a delivery form instead.

## Features

- **Home page**: hero, brand promises, five collection tiles, bestsellers, and a "how to order" guide.
- **Shop** (`/shop`): the full catalog with category filters, search and sorting. Filters live in the URL, so a link like `/shop?category=haircare` can be shared.
- **Product pages** (`/products/<slug>`): details, benefits, ingredients, a quantity picker, "Add to order", and a one-tap WhatsApp order for that product.
- **Order bag**: a slide-out drawer with quantity controls and the subtotal. "Send order on WhatsApp" opens WhatsApp with the order already written out. The bag is saved in the browser.
- **Order form** (`/order`): a delivery details form for customers without WhatsApp, handled by Netlify Forms. Submissions appear in the Netlify dashboard under **Forms → order**.

## Managing the catalog

Products, categories, prices, the currency, the delivery note and the **WhatsApp number** are all in [`src/lib/catalog.ts`](src/lib/catalog.ts).

> **Before launch:** set `store.whatsappNumber` to the shop's real WhatsApp number in international format, digits only (for example `923001234567`). The current value is a placeholder.

Category photos are in `public/img/` and are served resized through the Netlify Image CDN.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router, Vite)
- Tailwind CSS 4 and shadcn/ui components
- Netlify Forms for the order form, Netlify Image CDN for images
- Deployed on Netlify

## Running locally

```bash
pnpm install
netlify dev        # full Netlify emulation, including forms and the image CDN
# or
pnpm dev           # Vite only, on http://localhost:3000
```

Form submissions only work on Netlify (deploy previews or production), not with the plain Vite server.

## Ideas for later

- Per-product photos to replace the shared category images
- Managing products from an admin screen instead of editing the code
- Stock levels and "out of stock" labels
