import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold tracking-tighter text-foreground">
            Abdelrahman<span className="text-primary">.</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-left rtl:md:text-right">
            &copy; {currentYear} {t("Abdelrahman Mohamed", "عبدالرحمن محمد")}. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
