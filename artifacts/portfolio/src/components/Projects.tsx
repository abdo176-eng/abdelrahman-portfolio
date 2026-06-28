import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const { t } = useLanguage();

  const projects = [1, 2, 3];

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Projects", "معرض الأعمال")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-border bg-card">
                <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm border border-border/50 flex items-center justify-center">
                      <ExternalLink className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="flex-1 p-6">
                  <div className="w-3/4 h-8 rounded border-2 border-dashed border-muted-foreground/30 flex items-center px-3 mb-4">
                    <span className="text-sm text-muted-foreground/50 font-medium">
                      {t("Project Name", "اسم المشروع")}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-16 rounded-full bg-muted border border-border" />
                    <div className="h-6 w-20 rounded-full bg-muted border border-border" />
                    <div className="h-6 w-14 rounded-full bg-muted border border-border" />
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 mt-auto">
                  <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t("View Project", "عرض المشروع")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
