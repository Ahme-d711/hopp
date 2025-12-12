import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useProducts } from "@/hooks/usePorduct";

const Products = () => {
  const { t, isRTL } = useLanguage();
  const { data: products, isLoading, isError } = useProducts({ limit: 4 });
  
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <section id="products" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-medium mb-3">
            {t("featuredProducts")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
            {isRTL ? "شموع مصنوعة بحب" : "Candles Made with Love"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("featuredDescription")}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl overflow-hidden shadow-soft animate-pulse"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-5 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("errorLoadingProducts") || "Failed to load products"}</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noProducts") || "No products available"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  id={parseInt(product._id.slice(-8), 16) || 0}
                  image={product.image || ""}
                  name={product.name}
                  nameEn={product.nameEn}
                  description={product.description}
                  descriptionEn={product.descriptionEn}
                  price={product.price}
                  originalPrice={product.originalPrice}
                />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all duration-300 text-lg"
          >
            {t("viewAllProducts")}
            <span className={isRTL ? "rotate-180" : ""}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
