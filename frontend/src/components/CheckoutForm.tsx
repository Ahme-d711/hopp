import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutForm = ({ isOpen, onClose }: CheckoutFormProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const checkoutSchema = z.object({
    name: z.string().trim().min(3, t("nameRequired")).max(100),
    phone: z.string().trim().min(10, t("phoneRequired")).max(15),
    address: z.string().trim().min(10, t("addressRequired")).max(500),
    notes: z.string().max(500).optional(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = checkoutSchema.safeParse(formData);
      
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      const orderDetails = items
        .map((item) => `• ${item.name} (${item.quantity}x) - ${item.price * item.quantity} ${t("currency")}`)
        .join("\n");

      const brandName = isRTL ? "شموع حب" : "Love Candles";
      const message = isRTL ? `🕯️ *طلب جديد من ${brandName}*

*بيانات العميل:*
الاسم: ${formData.name}
الهاتف: ${formData.phone}
العنوان: ${formData.address}
${formData.notes ? `ملاحظات: ${formData.notes}` : ""}

*تفاصيل الطلب:*
${orderDetails}

*المجموع الكلي: ${totalPrice} ${t("currency")}*` : `🕯️ *New Order from ${brandName}*

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
${formData.notes ? `Notes: ${formData.notes}` : ""}

*Order Details:*
${orderDetails}

*Total: ${totalPrice} ${t("currency")}*`;

      const whatsappUrl = `https://wa.me/201011261236?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      setStep("success");
      clearCart();
      toast.success(isRTL ? "تم إرسال طلبك بنجاح!" : "Order sent successfully!");
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({ name: "", phone: "", address: "", notes: "" });
    setErrors({});
    onClose();
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            {step === "form" ? t("checkout") : (isRTL ? "تم الطلب بنجاح" : "Order Successful")}
          </SheetTitle>
        </SheetHeader>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-foreground mb-3">
                {isRTL ? "ملخص الطلب" : "Order Summary"}
              </h4>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{item.price * item.quantity} {t("currency")}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-primary">{totalPrice} {t("currency")}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")} *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isRTL ? "محمد أحمد" : "John Doe"}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneNumber")} *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                dir="ltr"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("address")} *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={isRTL ? "المحافظة، المدينة، الشارع، رقم المنزل..." : "City, Street, Building number..."}
                rows={3}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={isRTL ? "أي ملاحظات خاصة بالطلب..." : "Any special notes..."}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full mt-6"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting 
                ? (isRTL ? "جاري الإرسال..." : "Sending...") 
                : t("completeOrderViaWhatsapp")}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {isRTL ? "سيتم إرسال طلبك عبر واتساب للتأكيد" : "Your order will be sent via WhatsApp for confirmation"}
            </p>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              {isRTL ? "تم إرسال طلبك!" : "Order Sent!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL ? "سنتواصل معك قريباً لتأكيد الطلب والتوصيل" : "We will contact you soon to confirm your order and delivery"}
            </p>
            <Button variant="outline" onClick={handleClose}>
              <BackArrow className="w-4 h-4" />
              {t("back")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutForm;
