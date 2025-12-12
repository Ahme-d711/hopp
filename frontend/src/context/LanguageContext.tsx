import { createContext, useContext, useState, ReactNode } from "react";

type Language = "ar" | "en";

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navbar
  home: { ar: "الرئيسية", en: "Home" },
  products: { ar: "المنتجات", en: "Products" },
  aboutUs: { ar: "من نحن", en: "About Us" },
  contactUs: { ar: "تواصل معنا", en: "Contact Us" },
  brandName: { ar: "شموع حب", en: "Love Candles" },
  
  // Hero
  heroTitle1: { ar: "أضيء", en: "Light Up" },
  heroTitle2: { ar: "حياتك", en: "Your Life" },
  heroTitle3: { ar: "بالدفء والحب", en: "With Warmth & Love" },
  heroDescription: { 
    ar: "اكتشف مجموعتنا الفاخرة من الشموع المعطرة المصنوعة يدوياً بحب وعناية. كل شمعة قصة، كل عطر ذكرى.",
    en: "Discover our luxurious collection of handcrafted scented candles made with love and care. Every candle tells a story, every scent creates a memory."
  },
  shopNow: { ar: "تسوق الآن", en: "Shop Now" },
  discoverMore: { ar: "اكتشف المزيد", en: "Discover More" },
  
  // Products
  featuredProducts: { ar: "منتجاتنا المميزة", en: "Featured Products" },
  featuredDescription: { 
    ar: "مجموعة مختارة من أجمل الشموع المعطرة",
    en: "A curated collection of our finest scented candles"
  },
  viewAllProducts: { ar: "عرض جميع المنتجات", en: "View All Products" },
  addToCart: { ar: "أضف للسلة", en: "Add to Cart" },
  currency: { ar: "ج.م", en: "EGP" },
  allProducts: { ar: "جميع المنتجات", en: "All Products" },
  allProductsDescription: { 
    ar: "اكتشف مجموعتنا الكاملة من الشموع الفاخرة",
    en: "Discover our complete collection of luxury candles"
  },
  
  // About
  ourStory: { ar: "قصتنا", en: "Our Story" },
  weCreateWarmth: { ar: "نصنع الدفء", en: "We Create Warmth" },
  withLove: { ar: "بكل حب", en: "With Love" },
  aboutP1: { 
    ar: "بدأت شموع حب كحلم صغير لنشر الدفء والجمال في كل منزل. نؤمن بأن الشمعة ليست مجرد مصدر للضوء، بل هي تجربة حسية تخلق ذكريات وتملأ الأجواء بالسكينة والراحة.",
    en: "Love Candles started as a small dream to spread warmth and beauty in every home. We believe that a candle is not just a source of light, but a sensory experience that creates memories and fills the atmosphere with tranquility and comfort."
  },
  aboutP2: { 
    ar: "نختار مكوناتنا بعناية من أفضل المصادر العالمية، ونصنع كل شمعة بأيدينا لضمان أعلى مستوى من الجودة والإتقان.",
    en: "We carefully select our ingredients from the finest global sources, and handcraft each candle to ensure the highest level of quality and craftsmanship."
  },
  naturalIngredients: { ar: "مكونات طبيعية", en: "Natural Ingredients" },
  naturalIngredientsDesc: { 
    ar: "نستخدم شمع الصويا النقي والزيوت العطرية الطبيعية فقط",
    en: "We use only pure soy wax and natural essential oils"
  },
  handmade: { ar: "صناعة يدوية", en: "Handmade" },
  handmadeDesc: { 
    ar: "كل شمعة تُصنع بحب وعناية فائقة في مشغلنا الخاص",
    en: "Each candle is crafted with love and care in our workshop"
  },
  cleanBurn: { ar: "احتراق نظيف", en: "Clean Burn" },
  cleanBurnDesc: { 
    ar: "شموعنا تحترق بنظافة دون دخان أو سموم ضارة",
    en: "Our candles burn clean without smoke or harmful toxins"
  },
  premiumQuality: { ar: "جودة فاخرة", en: "Premium Quality" },
  premiumQualityDesc: { 
    ar: "نختار أجود المواد لضمان تجربة استثنائية",
    en: "We select the finest materials for an exceptional experience"
  },
  candleMaking: { ar: "صناعة الشموع", en: "Candle Making" },
  scentedCandles: { ar: "شموع معطرة", en: "Scented Candles" },
  warmAtmosphere: { ar: "أجواء دافئة", en: "Warm Atmosphere" },
  luxuryCandles: { ar: "شموع فاخرة", en: "Luxury Candles" },
  
  // Footer
  quickLinks: { ar: "روابط سريعة", en: "Quick Links" },
  brandDescription: { 
    ar: "نصنع شموعاً تضيء حياتك بالدفء والجمال. كل شمعة قطعة فنية فريدة مصنوعة بحب.",
    en: "We craft candles that light up your life with warmth and beauty. Each candle is a unique piece of art made with love."
  },
  faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
  allRightsReserved: { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved" },
  
  // Cart
  cart: { ar: "سلة التسوق", en: "Shopping Cart" },
  emptyCart: { ar: "سلتك فارغة", en: "Your cart is empty" },
  addProductsToStart: { ar: "أضف بعض المنتجات لبدء التسوق", en: "Add some products to start shopping" },
  browseProducts: { ar: "تصفح المنتجات", en: "Browse Products" },
  total: { ar: "المجموع", en: "Total" },
  checkout: { ar: "إتمام الطلب", en: "Checkout" },
  continueShopping: { ar: "متابعة التسوق", en: "Continue Shopping" },
  
  // Checkout
  customerDetails: { ar: "بيانات العميل", en: "Customer Details" },
  fullName: { ar: "الاسم الكامل", en: "Full Name" },
  phoneNumber: { ar: "رقم الهاتف", en: "Phone Number" },
  address: { ar: "العنوان", en: "Address" },
  notes: { ar: "ملاحظات (اختياري)", en: "Notes (Optional)" },
  completeOrderViaWhatsapp: { ar: "إتمام الطلب عبر واتساب", en: "Complete Order via WhatsApp" },
  back: { ar: "رجوع", en: "Back" },
  nameRequired: { ar: "الاسم مطلوب", en: "Name is required" },
  phoneRequired: { ar: "رقم الهاتف مطلوب", en: "Phone number is required" },
  addressRequired: { ar: "العنوان مطلوب", en: "Address is required" },
  
  // Wishlist
  wishlist: { ar: "المفضلة", en: "Wishlist" },
  emptyWishlist: { ar: "قائمة المفضلة فارغة", en: "Your wishlist is empty" },
  addFavoritesToStart: { ar: "أضف منتجاتك المفضلة", en: "Add your favorite products" },
  addToWishlist: { ar: "أضف للمفضلة", en: "Add to Wishlist" },
  removeFromWishlist: { ar: "إزالة من المفضلة", en: "Remove from Wishlist" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-body" : "font-body"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
