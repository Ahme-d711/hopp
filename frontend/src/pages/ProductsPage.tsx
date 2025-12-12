import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useProductsWithPagination } from "@/hooks/usePorduct";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ProductsPage = () => {
  const { t, isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12; // Products per page
  
  const { data, isLoading, isError } = useProductsWithPagination({
    page: currentPage,
    limit,
  });

  const products = data?.data.products || [];
  const pagination = data?.pagination;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowRight className={isRTL ? "" : "rotate-180"} />
                {t("back")}
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-medium mb-3">
              {t("shopNow")}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
              {t("allProducts")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("allProductsDescription")}
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, index) => (
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
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("noProducts") || "No products available"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
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

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasPrev) {
                          setCurrentPage((prev) => Math.max(1, prev - 1));
                        }
                      }}
                      className={!pagination.hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasNext) {
                          setCurrentPage((prev) => Math.min(pagination.pages, prev + 1));
                        }
                      }}
                      className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* Pagination Info */}
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} products
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProductsPage;
