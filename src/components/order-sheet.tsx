import { Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'

import { OrderLines } from '@/components/order-lines'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatPrice, store, whatsappLink } from '@/lib/catalog'
import { useOrder, whatsappOrderMessage } from '@/lib/order'

export function OrderSheet() {
  const { lines, total, isOpen, setOpen } = useOrder()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your order</SheetTitle>
          <SheetDescription>
            Review your items, then send the order to us on WhatsApp. We confirm availability and
            delivery charges in the chat, then share JazzCash details for advance payment.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <ShoppingBag className="size-6" />
            </span>
            <p className="font-medium">Your order bag is empty</p>
            <p className="text-sm text-muted-foreground">Add a few natural favourites to get started.</p>
            <Button asChild className="mt-2 rounded-full" onClick={() => setOpen(false)}>
              <Link to="/shop">Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <OrderLines />
            </div>
            <SheetFooter className="border-t">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{store.deliveryNote}</p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-whatsapp text-white hover:bg-whatsapp/90"
              >
                <a href={whatsappLink(whatsappOrderMessage(lines, total))} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-5" /> Send order on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                <Link to="/order">No WhatsApp? Order with a form</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
