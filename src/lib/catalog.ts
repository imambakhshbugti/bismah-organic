// Store settings and product catalog. Edit this file to change products,
// prices, or the WhatsApp number orders are sent to.

export const store = {
  name: 'Bismah Organic',
  tagline: 'Pure, natural goods — made in small batches',
  // International format, digits only (country code + number, no "+" or spaces).
  whatsappNumber: '923252731743',
  email: 'bishhorganic@gmail.com',
  currency: 'Rs.',
  deliveryNote:
    'No cash on delivery: full payment via JazzCash before dispatch. Delivery in 2–5 working days.',
}

export type CategoryId = 'skincare' | 'haircare' | 'remedies'

export type Category = {
  id: CategoryId
  name: string
  blurb: string
  image: string
}

const allCategories: Category[] = [
  {
    id: 'skincare',
    name: 'Skincare',
    blurb: 'Handmade soaps, butters and floral waters for everyday glow.',
    image: '/img/skincare.jpg',
  },
  {
    id: 'haircare',
    name: 'Hair Oils',
    blurb: 'Slow-infused herbal oils for strong roots and shine.',
    image: '/img/haircare.jpg',
  },
  {
    id: 'remedies',
    name: 'Herbal Remedies',
    blurb: 'Time-honoured herbs, seeds and powders from nature’s pharmacy.',
    image: '/img/remedies.jpg',
  },
]

export type Product = {
  slug: string
  name: string
  category: CategoryId
  price: number
  size: string
  description: string
  benefits: string[]
  ingredients: string
  bestseller?: boolean
  /** Product photo in /public. Falls back to the category image. */
  image?: string
}

export const products: Product[] = [
  {
    slug: 'nila-moroccan-organic-soap',
    name: 'Nila Moroccan Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Premium organic Moroccan Nila soap crafted into a rose shape for skin brightening and deeply nourishing care.',
    benefits: ['Brightens skin', 'Deeply nourishing', 'Handmade rose bar'],
    ingredients: 'Moroccan Nila',
    image: '/img/products/nila-moroccan-soap.png',
  },
  {
    slug: 'rice-milk-organic-soap',
    name: 'Rice & Milk Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Nourishing organic rice and milk soap in a rose design for gentle exfoliation and smooth, glowing skin.',
    benefits: ['Gentle exfoliation', 'Smooth skin', 'Natural glow'],
    ingredients: 'Rice, milk',
    image: '/img/products/rice-milk-soap.png',
  },
  {
    slug: 'coffee-organic-soap',
    name: 'Coffee Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Exfoliating organic coffee soap crafted in a rose shape, perfect for revitalizing and toning the skin.',
    benefits: ['Exfoliates', 'Revitalizes', 'Tones skin'],
    ingredients: 'Coffee',
    image: '/img/products/coffee-soap.png',
  },
  {
    slug: 'sandal-organic-soap',
    name: 'Sandal Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Pure sandalwood organic soap shaped like a rose for a soothing aroma and radiant complexion.',
    benefits: ['Soothing aroma', 'Radiant complexion', 'Pure sandalwood'],
    ingredients: 'Sandalwood',
    image: '/img/products/sandal-soap.png',
  },
  {
    slug: 'ubtan-organic-soap',
    name: 'Ubtan Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Traditional organic Ubtan soap in a rose mold to brighten skin tone and enhance natural glow.',
    benefits: ['Brightens skin tone', 'Natural glow', 'Traditional recipe'],
    ingredients: 'Ubtan',
    image: '/img/products/ubtan-soap.png',
  },
  {
    // Slug kept from the earlier, longer product name so shared links still work.
    slug: 'goat-milk-alpha-arbutin-kojic-acid-organic-soap',
    name: 'Goat Milk Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Premium organic goat milk soap with Alpha Arbutin and Kojic Acid to brighten skin, fade dark spots, and even out skin tone.',
    benefits: ['Brightens skin', 'Fades dark spots', 'Evens skin tone'],
    ingredients: 'Goat milk, alpha arbutin, kojic acid',
    image: '/img/products/goat-milk-soap.png',
  },
  {
    slug: 'neem-organic-soap',
    name: 'Neem Organic Soap',
    category: 'skincare',
    price: 599,
    size: 'Rose-shaped bar',
    description:
      'Natural neem organic soap shaped like a rose, ideal for skin clarity, acne care, and deep cleansing.',
    benefits: ['Skin clarity', 'Acne care', 'Deep cleansing'],
    ingredients: 'Neem',
    image: '/img/products/neem-soap.png',
  },
]

// Only categories that currently have products are shown on the site.
export const categories = allCategories.filter((c) =>
  products.some((p) => p.category === c.id),
)

export function getCategory(id: CategoryId) {
  return allCategories.find((c) => c.id === id)!
}

export function productImage(product: Product) {
  return product.image ?? getCategory(product.category).image
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function formatPrice(amount: number) {
  return `${store.currency} ${amount.toLocaleString('en-US')}`
}

/** Netlify Image CDN URL for a file in /public. */
export function imageUrl(src: string, width: number) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp`
}

export function whatsappLink(text: string) {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(text)}`
}
