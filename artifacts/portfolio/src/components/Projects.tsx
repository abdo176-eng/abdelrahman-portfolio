import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Globe, ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { getProjects, type Project } from "@/lib/store";

const GRADIENTS = [
  "from-blue-500/20 to-teal-500/20",
  "from-purple-500/20 to-blue-500/20",
  "from-teal-500/20 to-green-500/20",
  "from-orange-500/20 to-red-500/20",
  "from-pink-500/20 to-purple-500/20",
  "from-indigo-500/20 to-cyan-500/20",
];

/* ─── Project Modal ─── */
function ProjectModal({
  project,
  open,
  onClose,
  language,
  t,
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  language: string;
  t: (en: string, ar: string) => string;
}) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (open) setImgIdx(0);
  }, [open, project]);

  if (!project) return null;

  const title  = language === "ar" && project.titleAr ? project.titleAr : project.titleEn;
  const desc   = language === "ar" && project.descAr  ? project.descAr  : project.descEn;
  const images = project.images ?? [];
  const hasImages = images.length > 0;

  function prev() { setImgIdx(i => (i - 1 + images.length) % images.length); }
  function next() { setImgIdx(i => (i + 1) % images.length); }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border">
        {/* Image Gallery */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {hasImages ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={`${title} - ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/40"}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                    {imgIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="h-12 w-12 opacity-30" />
              <span className="text-sm opacity-50">{t("No images added", "لا توجد صور")}</span>
            </div>
          )}
        </div>

        {/* Thumbnails row */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all ${
                  i === imgIdx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="p-5">
          <DialogHeader className="mb-3 text-start">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </DialogHeader>

          {desc && <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{desc}</p>}

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                {t("Open Project", "فتح المشروع")}
              </Button>
            </a>
          ) : (
            <Button variant="secondary" className="w-full" disabled>
              {t("No link available", "لا يوجد رابط")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Placeholder Card ─── */
function PlaceholderCard({ idx, t }: { idx: number; t: (en: string, ar: string) => string }) {
  const gradient = GRADIENTS[idx % GRADIENTS.length];
  return (
    <Card className="overflow-hidden h-full flex flex-col group border-border bg-card border-dashed opacity-60">
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

/* ─── Real Project Card ─── */
function ProjectCard({
  project, idx, language, t, onClick,
}: {
  project: Project; idx: number; language: string;
  t: (en: string, ar: string) => string;
  onClick: () => void;
}) {
  const gradient = project.gradient || GRADIENTS[idx % GRADIENTS.length];
  const title    = language === "ar" && project.titleAr ? project.titleAr : project.titleEn;
  const desc     = language === "ar" && project.descAr  ? project.descAr  : project.descEn;
  const images   = project.images ?? [];
  const thumb    = images[0] ?? null;

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-border bg-card cursor-pointer hover:-translate-y-1"
    >
      {/* Thumbnail / gradient */}
      <div className={`relative aspect-video overflow-hidden ${thumb ? "" : `bg-gradient-to-br ${gradient}`}`}>
        {thumb ? (
          <img src={thumb} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-background/30 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="h-6 w-6 text-white/70" />
            </div>
          </div>
        )}

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {images.length} {t("photos", "صور")}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full backdrop-blur-sm">
            {t("Click to view", "اضغط للعرض")}
          </span>
        </div>
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
        <Button className="w-full gap-2 pointer-events-none" variant="secondary">
          <ExternalLink className="h-4 w-4" />
          {t("View Details", "عرض التفاصيل")}
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ─── Main Section ─── */
export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

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
                : <ProjectCard
                    project={item}
                    idx={idx}
                    language={language}
                    t={t}
                    onClick={() => setSelected(item)}
                  />
              }
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        language={language}
        t={t}
      />
    </section>
  );
}
