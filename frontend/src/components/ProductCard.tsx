import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  originalPrice?: number;
}

const ProductCard = ({ id, image, name, nameEn, description, descriptionEn, price, originalPrice }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { t, isRTL } = useLanguage();

  const isLiked = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({ id, name: isRTL ? name : (nameEn || name), price, image });
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        nameEn: nameEn || name,
        price,
        image,
        description,
        descriptionEn: descriptionEn || description,
      });
    }
  };

  const displayName = isRTL ? name : (nameEn || name);
  const displayDescription = isRTL ? description : (descriptionEn || description);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Like Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 left-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-background hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isLiked ? "text-rose fill-rose" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Sale Badge */}
        {originalPrice && (
          <div className="absolute top-4 right-4 bg-rose text-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {isRTL ? "تخفيض" : "Sale"}
          </div>
        )}

        {/* Quick Add */}
        <div className="absolute bottom-4 right-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button variant="hero" className="w-full" size="default" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4" />
            {t("addToCart")}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
          {displayName}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {displayDescription}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-heading font-semibold text-primary">
            {price} {t("currency")}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice} {t("currency")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
