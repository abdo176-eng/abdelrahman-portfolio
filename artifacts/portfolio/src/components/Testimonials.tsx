import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [1, 2, 3];

  return (
    <section className="py-24 bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Client Testimonials", "آراء العملاء")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-background border-border relative overflow-hidden">
                <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto text-primary/10">
                  <Quote className="h-12 w-12" />
                </div>
                <CardContent className="p-8 pt-10">
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="h-4 w-full rounded bg-muted/60" />
                    <div className="h-4 w-5/6 rounded bg-muted/60" />
                    <div className="h-4 w-4/6 rounded bg-muted/60" />
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {t("CL", "عم")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="h-4 w-24 rounded bg-muted mb-2" />
                      <div className="h-3 w-16 rounded bg-muted/60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
