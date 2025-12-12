import { Flame, Heart, Leaf, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import aboutImage1 from "@/assets/about-1.jpg";
import aboutImage2 from "@/assets/about-2.jpg";
import aboutImage3 from "@/assets/about-3.jpg";
import aboutImage4 from "@/assets/about-4.jpg";

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Leaf,
      title: t("naturalIngredients"),
      description: t("naturalIngredientsDesc"),
    },
    {
      icon: Heart,
      title: t("handmade"),
      description: t("handmadeDesc"),
    },
    {
      icon: Flame,
      title: t("cleanBurn"),
      description: t("cleanBurnDesc"),
    },
    {
      icon: Award,
      title: t("premiumQuality"),
      description: t("premiumQualityDesc"),
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <span className="inline-block text-primary font-medium mb-3">
              {t("ourStory")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
              {t("weCreateWarmth")}
              <br />
              <span className="text-primary">{t("withLove")}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("aboutP1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("aboutP2")}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="order-1 md:order-2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card animate-scale-in">
                  <img
                    src={aboutImage1}
                    alt={t("candleMaking")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-card animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <img
                    src={aboutImage2}
                    alt={t("scentedCandles")}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-card animate-scale-in" style={{ animationDelay: "0.3s" }}>
                  <img
                    src={aboutImage3}
                    alt={t("warmAtmosphere")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card animate-scale-in" style={{ animationDelay: "0.4s" }}>
                  <img
                    src={aboutImage4}
                    alt={t("luxuryCandles")}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
