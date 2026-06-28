import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import profilePhoto from "@assets/photo_2026-06-28_18-30-27_1782660713913.jpg";

export default function Hero() {
  const { t, language } = useLanguage();

  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-start rtl:lg:text-right"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 rtl:ml-2 rtl:mr-0 animate-pulse" />
              {t("Available for new projects", "متاح لمشاريع جديدة")}
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              <span className="block text-muted-foreground text-3xl sm:text-4xl mb-2 font-medium">
                {t("Hi, I'm", "مرحباً، أنا")}
              </span>
              {t("Abdelrahman Mohamed", "عبدالرحمن محمد")}
            </h1>

            <h2 className="text-2xl sm:text-3xl font-semibold text-secondary mb-6">
              {t("Web Developer", "مطور مواقع إلكترونية")}
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t(
                "I design and build professional websites for businesses, e-commerce stores, and educational platforms using the latest web technologies.",
                "أصمم وأطور مواقع إلكترونية احترافية للشركات والمتاجر الإلكترونية والمنصات التعليمية باستخدام أحدث تقنيات الويب."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8" asChild>
                <a href="#projects">
                  {t("View My Work", "شاهد أعمالي")}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 group" asChild>
                <a href="#contact">
                  {t("Contact Me", "تواصل معي")}
                  <ArrowIcon className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-105 animate-spin-slow" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-0 rounded-full border border-secondary/40 scale-110 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-2xl" />
              <img
                src={profilePhoto}
                alt={t("Abdelrahman Mohamed", "عبدالرحمن محمد")}
                className="rounded-full w-full h-full object-cover border-4 border-background shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
