import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-candle.jpg";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={t("brandName")}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/80 via-black/60 to-black/40`} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-rose/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className={`max-w-2xl ${isRTL ? 'mr-auto text-right' : 'ml-auto text-left'}`}>
          <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              {isRTL ? "شموع طبيعية 100%" : "100% Natural Candles"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {t("heroTitle1")}
            <br />
            <span className="text-primary">{t("heroTitle3")}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {t("heroDescription")}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/products">{t("shopNow")}</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#about">{t("discoverMore")}</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.8s" }}>
            <div className="text-center">
              <div className="text-3xl font-heading font-semibold text-primary">+50</div>
              <div className="text-sm text-muted-foreground">{isRTL ? "منتج فريد" : "Unique Products"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-semibold text-primary">+1000</div>
              <div className="text-sm text-muted-foreground">{isRTL ? "عميل سعيد" : "Happy Customers"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-semibold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">{isRTL ? "طبيعي" : "Natural"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
