import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ShoppingCart, LayoutTemplate, Code, LineChart } from "lucide-react";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t("Company Websites", "مواقع الشركات"),
      desc: t("Professional digital presence for your business.", "واجهة رقمية احترافية لشركتك تعكس هويتك."),
    },
    {
      icon: ShoppingCart,
      title: t("E-Commerce Stores", "المتاجر الإلكترونية"),
      desc: t("Robust online stores optimized for sales.", "متاجر إلكترونية متكاملة ومحسنة لزيادة المبيعات."),
    },
    {
      icon: LayoutTemplate,
      title: t("Landing Pages", "صفحات الهبوط"),
      desc: t("High-converting pages for marketing campaigns.", "صفحات هبوط ذات معدل تحويل عالي لحملاتك التسويقية."),
    },
    {
      icon: Code,
      title: t("Custom Web Development", "تطوير مواقع مخصصة"),
      desc: t("Tailored solutions for specific business needs.", "حلول برمجية مخصصة لتلبية احتياجات عملك الخاصة."),
    },
  ];

  return (
    <section id="services" className="py-24 bg-card/50 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Services", "خدماتي")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-background transition-all duration-300 hover:border-violet-500/50">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-violet-500/10 border border-violet-500/20 p-8 flex items-center gap-6">
            <div className="h-16 w-16 shrink-0 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center hidden sm:flex">
              <LineChart className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">
                {t("Plus: Marketing Tools Integration", "بالإضافة إلى: ربط أدوات التسويق")}
              </h4>
              <p className="text-muted-foreground">
                {t(
                  "Integration with Meta Pixel, Google Analytics, and Tag Manager to track conversions and optimize your ad spend.",
                  "ربط الموقع مع بيكسل فيسبوك، إحصائيات جوجل، وتاج مانجر لتتبع التحويلات وتحسين ميزانية إعلاناتك."
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
