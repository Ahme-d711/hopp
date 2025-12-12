import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const WishlistSheet = () => {
  const { items, totalItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: language === "ar" ? item.name : item.nameEn,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="w-5 h-5" />
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
          <SheetTitle className="font-heading text-xl">{t("wishlist")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{t("emptyWishlist")}</p>
            <p className="text-sm text-muted-foreground/70 mb-4">{t("addFavoritesToStart")}</p>
            <SheetClose asChild>
              <Button variant="outline" asChild>
                <Link to="/products">{t("browseProducts")}</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <div className="flex flex-col h-full py-4">
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={language === "ar" ? item.name : item.nameEn}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {language === "ar" ? item.name : item.nameEn}
                    </h4>
                    <p className="text-primary font-heading font-semibold">
                      {item.price} {t("currency")}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-primary hover:text-primary/80"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {t("addToCart")}
                    </Button>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
