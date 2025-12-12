import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CheckoutForm from "@/components/CheckoutForm";
import { Link } from "react-router-dom";

const CartSheet = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { t, language } = useLanguage();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader className="flex flex-row items-center gap-2">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className={language === "ar" ? "rotate-180" : ""}>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </SheetClose>
            <SheetTitle className="font-heading text-xl">{t("cart")}</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{t("emptyCart")}</p>
              <p className="text-sm text-muted-foreground/70 mb-4">{t("addProductsToStart")}</p>
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link to="/products">{t("browseProducts")}</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.name}
                      </h4>
                      <p className="text-primary font-heading font-semibold">
                        {item.price} {t("currency")}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 pb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("total")}</span>
                  <span className="text-2xl font-heading font-semibold text-primary">
                    {totalPrice} {t("currency")}
                  </span>
                </div>
                <Button 
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  {t("checkout")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={clearCart}
                >
                  {t("continueShopping")}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutForm isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

export default CartSheet;
