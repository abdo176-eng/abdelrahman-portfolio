import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe } from "lucide-react";
import { getProjects, type Project } from "@/lib/store";

const GRADIENTS = [
  "from-blue-500/20 to-teal-500/20",
  "from-purple-500/20 to-blue-500/20",
  "from-teal-500/20 to-green-500/20",
  "from-orange-500/20 to-red-500/20",
  "from-pink-500/20 to-purple-500/20",
  "from-indigo-500/20 to-cyan-500/20",
];

function PlaceholderCard({ idx, t }: { idx: number; t: (en: string, ar: string) => string }) {
  const gradient = GRADIENTS[idx % GRADIENTS.length];
  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-border bg-card border-dashed opacity-60">
      <div className={`relative aspect-video bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm border border-border/50 flex items-center justify-center">
            <Globe className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>
      <CardContent className="flex-1 p-6">
        <div className="w-3/4 h-7 rounded border-2 border-dashed border-muted-foreground/30 flex items-center px-3 mb-4">
          <span className="text-sm text-muted-foreground/50 font-medium">{t("Project Name", "اسم المشروع")}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-16 rounded-full bg-muted border border-border" />
          <div className="h-6 w-20 rounded-full bg-muted border border-border" />
          <div className="h-6 w-14 rounded-full bg-muted border border-border" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <Button variant="secondary" className="w-full" disabled>
          {t("View Project", "عرض المشروع")}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProjectCard({ project, idx, language, t }: { project: Project; idx: number; language: string; t: (en: string, ar: string) => string }) {
  const gradient = project.gradient || GRADIENTS[idx % GRADIENTS.length];
  const title = language === "ar" && project.titleAr ? project.titleAr : project.titleEn;
  const desc  = language === "ar" && project.descAr  ? project.descAr  : project.descEn;

  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-border bg-card">
      <div className={`relative aspect-video bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-background/30 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ExternalLink className="h-6 w-6 text-white/70" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="flex-1 p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        {desc && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{desc}</p>}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ExternalLink className="h-4 w-4" />
              {t("View Project", "عرض المشروع")}
            </Button>
          </a>
        ) : (
          <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {t("View Project", "عرض المشروع")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    function load() { setProjects(getProjects()); }
    load();
    window.addEventListener("portfolio-projects-changed", load);
    return () => window.removeEventListener("portfolio-projects-changed", load);
  }, []);

  const items = projects.length > 0 ? projects : [0, 1, 2];

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
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4 opacity-60">{t("Projects coming soon", "المشاريع قريباً")}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={typeof item === "number" ? `placeholder-${item}` : item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              {typeof item === "number"
                ? <PlaceholderCard idx={item} t={t} />
                : <ProjectCard project={item} idx={idx} language={language} t={t} />
              }
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
