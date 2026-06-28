import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Code2, Users, Clock } from "lucide-react";
import { getStats, type StatItem } from "@/lib/store";

const ICONS = [Code2, Clock, Users, CheckCircle2];

export default function About() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    function load() { setStats(getStats()); }
    load();
    window.addEventListener("portfolio-stats-changed", load);
    return () => window.removeEventListener("portfolio-stats-changed", load);
  }, []);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("About Me", "من أنا")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t(
              "I'm Abdelrahman Mohamed, a web developer specializing in company websites, e-commerce stores, landing pages, and educational platforms. I focus on delivering fast, user-friendly websites that help businesses grow their customer base and improve their digital presence.",
              "أنا عبدالرحمن محمد، مطور مواقع إلكترونية متخصص في إنشاء مواقع الشركات والمتاجر الإلكترونية وصفحات الهبوط والمنصات التعليمية. أهتم بتقديم مواقع سريعة وسهلة الاستخدام تساعد أصحاب المشاريع على زيادة العملاء وتحسين وجودهم الرقمي."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const value = language === "ar" && stat.valueAr ? stat.valueAr : stat.valueEn;
            const label = language === "ar" && stat.labelAr ? stat.labelAr : stat.labelEn;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-md bg-card">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-full mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-3xl font-bold text-foreground mb-1">{value}</h4>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
