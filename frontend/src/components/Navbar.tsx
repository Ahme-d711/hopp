import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import CartSheet from "@/components/CartSheet";
import WishlistSheet from "@/components/WishlistSheet";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { name: t("home"), href: "/", isAnchor: false },
    { name: t("products"), href: "/products", isAnchor: false },
    { name: t("aboutUs"), href: "#about", isAnchor: true },
    { name: t("contactUs"), href: "#contact", isAnchor: true },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const handleAnchorClick = (href: string) => {
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt={t("brandName")} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
            <span className="font-heading text-xl md:text-2xl font-semibold text-foreground">
              {t("brandName")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.name}
                  onClick={() => handleAnchorClick(link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Cart, Language & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="relative"
              title={language === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                {language === "ar" ? "EN" : "ع"}
              </span>
            </Button>

            <WishlistSheet />
            <CartSheet />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <button
                    key={link.name}
                    onClick={() => handleAnchorClick(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-right"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
