import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Palette, Zap, Headset, Smartphone, ThumbsUp, Code2, Gauge, CheckSquare } from "lucide-react";

export default function WhyChooseMe() {
  const { t } = useLanguage();

  const reasons = [
    { icon: Palette, title: t("Professional Design", "تصميم احترافي") },
    { icon: Zap, title: t("Fast Delivery", "تسليم سريع") },
    { icon: Headset, title: t("Post-delivery Support", "دعم فني بعد التسليم") },
    { icon: Smartphone, title: t("Mobile Compatible", "متوافق مع الجوال") },
    { icon: ThumbsUp, title: t("Excellent UX", "تجربة مستخدم ممتازة") },
    { icon: Code2, title: t("Clean Code", "أكواد نظيفة") },
    { icon: Gauge, title: t("Performance Optimization", "تحسين الأداء") },
    { icon: CheckSquare, title: t("Attention to Detail", "اهتمام بالتفاصيل") },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Why Choose Me", "لماذا تختارني؟")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border/50 hover:border-violet-500/50 transition-all duration-300 text-center"
            >
              <div className="h-12 w-12 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{reason.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
