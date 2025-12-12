import { Instagram, Facebook, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-foreground text-background py-16 md:py-20 shadow-[0_-30px_80px_rgba(0,0,0,0.6)]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt={t("brandName")} className="w-10 h-10 object-contain" />
              <span className="font-heading text-2xl font-semibold">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-background/70 mb-6 leading-relaxed">
              {t("brandDescription")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/7opcandles?igsh=NWo2bmdpdzdneDcy&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-gold hover:text-foreground rounded-full flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1Bn8NDUFnc/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-gold hover:text-foreground rounded-full flex items-center justify-center transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-background/70 hover:text-gold transition-colors duration-300"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-background/70 hover:text-gold transition-colors duration-300"
                >
                  {t("products")}
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-background/70 hover:text-gold transition-colors duration-300"
                >
                  {t("aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-background/70 hover:text-gold transition-colors duration-300"
                >
                  {t("faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">
              {t("contactUs")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-gold" />
                <span dir="ltr">+20 101 126 1236</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-gold" />
                <span>بلطيم، كفر الشيخ، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} {t("brandName")}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
