import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiHtml5, SiJavascript, SiReact, SiTypescript, SiTailwindcss, SiFirebase, SiGit, SiGithub, SiVercel } from "react-icons/si";

function Css3Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
    </svg>
  );
}

export default function Skills() {
  const { t } = useLanguage();

  const categories = [
    {
      title: t("Front-End", "تطوير الواجهات"),
      skills: [
        { name: "HTML5", icon: SiHtml5, color: "text-[#E34F26]" },
        { name: "CSS3", icon: Css3Icon, color: "text-[#1572B6]" },
        { name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]" },
        { name: "TypeScript", icon: SiTypescript, color: "text-[#3178C6]" },
        { name: "React", icon: SiReact, color: "text-[#61DAFB]" },
        { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-[#06B6D4]" },
      ],
    },
    {
      title: t("Back-End & Database", "الخوادم وقواعد البيانات"),
      skills: [
        { name: "Firebase", icon: SiFirebase, color: "text-[#FFCA28]" },
        { name: "Firestore", icon: SiFirebase, color: "text-[#FFCA28]" },
      ],
    },
    {
      title: t("Tools", "الأدوات"),
      skills: [
        { name: "Git", icon: SiGit, color: "text-[#F05032]" },
        { name: "GitHub", icon: SiGithub, color: "text-foreground" },
        { name: "Vercel", icon: SiVercel, color: "text-foreground" },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Technical Skills", "المهارات التقنية")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-background border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-center text-primary">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex flex-col items-center p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
                        <skill.icon className={`h-8 w-8 mb-2 ${skill.color}`} />
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      </div>
                    ))}
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
