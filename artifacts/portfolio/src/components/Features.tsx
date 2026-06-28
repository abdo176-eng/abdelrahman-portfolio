import { motion } from "framer-motion";
import { Smartphone, Zap, Target, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Smartphone,
      title: t("Responsive Design", "تصميم متجاوب"),
      desc: t("Flawless on all devices", "يعمل على جميع الأجهزة"),
    },
    {
      icon: Zap,
      title: t("High Performance", "أداء عالي"),
      desc: t("Lightning fast loading", "سرعة تحميل فائقة"),
    },
    {
      icon: Target,
      title: t("Meta Pixel", "ربط ميتا بيكسل"),
      desc: t("Advanced tracking", "تتبع متقدم للحملات"),
    },
    {
      icon: Search,
      title: t("SEO Optimized", "مهيأ لمحركات البحث"),
      desc: t("Built for search engines", "أكواد نظيفة ومحسنة"),
    },
  ];

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
