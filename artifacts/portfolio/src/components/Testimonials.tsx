import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Quote, PenLine, X, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getApprovedReviews, submitReview, type Review } from "@/lib/store";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star className={`h-6 w-6 transition-colors ${star <= (hover || value) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, idx }: { review: Review; idx: number }) {
  const initials = review.name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
    >
      <Card className="h-full bg-background border-border relative overflow-hidden hover:shadow-lg transition-shadow">
        <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto text-primary/10">
          <Quote className="h-12 w-12" />
        </div>
        <CardContent className="p-8 pt-10">
          <StarRating value={review.rating} />
          <p className="text-foreground/80 text-sm leading-relaxed mt-4 mb-8">{review.text}</p>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{review.name}</p>
              {review.role && <p className="text-xs text-muted-foreground">{review.role}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlaceholderCard({ idx, t }: { idx: number; t: (en: string, ar: string) => string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
      <Card className="h-full bg-background border-border border-dashed relative overflow-hidden opacity-50">
        <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto text-primary/10"><Quote className="h-12 w-12" /></div>
        <CardContent className="p-8 pt-10">
          <div className="flex gap-1 mb-6">{[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-secondary text-secondary" />)}</div>
          <div className="space-y-3 mb-8">
            <div className="h-4 w-full rounded bg-muted/60" />
            <div className="h-4 w-5/6 rounded bg-muted/60" />
            <div className="h-4 w-4/6 rounded bg-muted/60" />
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border"><AvatarFallback className="bg-primary/10 text-primary font-bold">{t("CL","عم")}</AvatarFallback></Avatar>
            <div><div className="h-4 w-24 rounded bg-muted mb-2" /><div className="h-3 w-16 rounded bg-muted/60" /></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReviewForm({ onClose, onSubmitted, t }: { onClose: () => void; onSubmitted: () => void; t: (en: string, ar: string) => string }) {
  const [name, setName]   = useState("");
  const [role, setRole]   = useState("");
  const [text, setText]   = useState("");
  const [rating, setRating] = useState(5);
  const [done, setDone]   = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) { setError(t("Name and review text are required.", "الاسم ونص التقييم مطلوبان.")); return; }
    submitReview({ name: name.trim(), role: role.trim(), text: text.trim(), rating });
    setDone(true);
    setTimeout(() => { onSubmitted(); onClose(); }, 2000);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        {done ? (
          <div className="text-center py-8">
            <CheckCircle className="h-14 w-14 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">{t("Thank you!", "شكراً لك!")}</h3>
            <p className="text-muted-foreground text-sm">{t("Your review has been submitted for approval.", "تم إرسال تقييمك للمراجعة.")}</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-foreground mb-1">{t("Write a Review", "اكتب تقييمك")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("Share your experience working with me.", "شاركنا تجربتك في العمل معي.")}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">{t("Your Rating", "تقييمك")}</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">{t("Name", "الاسم")} <span className="text-destructive">*</span></label>
                <Input placeholder={t("Your full name", "اسمك الكامل")} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">{t("Role / Company", "الوظيفة / الشركة")}</label>
                <Input placeholder={t("e.g. CEO at Example Co.", "مثلاً: مدير تنفيذي")} value={role} onChange={e => setRole(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">{t("Review", "التقييم")} <span className="text-destructive">*</span></label>
                <Textarea placeholder={t("Tell us about your experience...", "أخبرنا عن تجربتك...")} value={text} onChange={e => setText(e.target.value)} className="min-h-[100px] resize-none" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">{t("Submit Review", "إرسال التقييم")}</Button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  function load() { setReviews(getApprovedReviews()); }

  useEffect(() => {
    load();
    window.addEventListener("portfolio-reviews-changed", load);
    return () => window.removeEventListener("portfolio-reviews-changed", load);
  }, []);

  const displayItems = reviews.length > 0 ? reviews : null;

  return (
    <section className="py-24 bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Client Testimonials", "آراء العملاء")}</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 text-sm">{t("What clients say about working with me.", "ماذا يقول العملاء عن العمل معي.")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayItems
            ? displayItems.map((r, idx) => <ReviewCard key={r.id} review={r} idx={idx} />)
            : [0, 1, 2].map(i => <PlaceholderCard key={i} idx={i} t={t} />)
          }
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          {submitted ? (
            <div className="inline-flex items-center gap-2 text-primary font-medium">
              <CheckCircle className="h-5 w-5" />
              {t("Review submitted — pending approval.", "تم إرسال التقييم — في انتظار الموافقة.")}
            </div>
          ) : (
            <Button variant="outline" className="gap-2" onClick={() => setShowForm(true)}>
              <PenLine className="h-4 w-4" />
              {t("Write a Review", "اكتب تقييمك")}
            </Button>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <ReviewForm
            t={t}
            onClose={() => setShowForm(false)}
            onSubmitted={() => { setSubmitted(true); load(); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
