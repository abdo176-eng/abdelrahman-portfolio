import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, LogOut, Mail, CheckCircle, Trash2, Eye, EyeOff,
  Lock, User, LayoutDashboard, MessageSquare, Clock,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Settings, Save, KeyRound, ShieldCheck,
  FolderOpen, Plus, Pencil, Star, ThumbsUp, Globe2, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProjects, saveProject, updateProject, deleteProject, type Project,
  getReviews, approveReview, deleteReview, type Review,
  getStats, saveStats, type StatItem,
} from "@/lib/store";

/* ─── Admin-specific localStorage keys ─── */
const SESSION_KEY  = "admin_session";
const MESSAGES_KEY = "contact_messages";
const SETTINGS_KEY = "admin_settings";

interface AdminSettings { username: string; password: string; shortcutKey: string; }
const DEFAULT: AdminSettings = { username: "admin", password: "Abdo1662006", shortcutKey: "6" };

export function getAdminSettings(): AdminSettings {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; }
  catch { return DEFAULT; }
}
function persistSettings(s: AdminSettings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

export interface ContactMessage {
  id: string; name: string; email: string; phone: string;
  projectType: string; message: string; timestamp: string; read: boolean;
}
export function saveMessage(msg: Omit<ContactMessage, "id" | "timestamp" | "read">) {
  const list: ContactMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
  const newMsg: ContactMessage = { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString(), read: false };
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([newMsg, ...list]));
}

const GRADIENTS = [
  { label: "Blue → Teal",    value: "from-blue-500/20 to-teal-500/20" },
  { label: "Purple → Blue",  value: "from-purple-500/20 to-blue-500/20" },
  { label: "Teal → Green",   value: "from-teal-500/20 to-green-500/20" },
  { label: "Orange → Red",   value: "from-orange-500/20 to-red-500/20" },
  { label: "Pink → Purple",  value: "from-pink-500/20 to-purple-500/20" },
  { label: "Indigo → Cyan",  value: "from-indigo-500/20 to-cyan-500/20" },
];
const PROJECT_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  company:   { en: "Company Website",  ar: "موقع شركة" },
  ecommerce: { en: "E-Commerce",        ar: "متجر إلكتروني" },
  landing:   { en: "Landing Page",      ar: "صفحة هبوط" },
  other:     { en: "Other",             ar: "أخرى" },
};

/* ════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════ */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-foreground">{children}</label>;
}
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><FieldLabel>{label}</FieldLabel>{children}</div>;
}
function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`h-4 w-4 ${s <= value ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   LOGIN
════════════════════════════════════════════════════════ */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    setTimeout(() => {
      const s = getAdminSettings();
      if (username === s.username && password === s.password) {
        sessionStorage.setItem(SESSION_KEY, "1"); onLogin();
      } else {
        setError(t("Invalid username or password.", "اسم المستخدم أو كلمة المرور غير صحيحة."));
      }
      setLoading(false);
    }, 500);
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-sm border-border bg-card shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("Admin Panel", "لوحة التحكم")}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{t("Sign in to manage your portfolio", "سجل دخولك لإدارة بورتفوليوك")}</p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormRow label={t("Username", "اسم المستخدم")}>
              <div className="relative">
                <User className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 rtl:pr-10 rtl:pl-3" placeholder="admin"
                  value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </FormRow>
            <FormRow label={t("Password", "كلمة المرور")}>
              <div className="relative">
                <Lock className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 rtl:pr-10 rtl:pl-3 pr-10" type={showPass ? "text" : "password"}
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormRow>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("Signing in…", "جاري تسجيل الدخول…") : t("Sign In", "دخول")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   MESSAGES TAB
════════════════════════════════════════════════════════ */
function MessagesTab() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setMessages(JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]"));
  }, []);

  useEffect(() => { refresh(); const id = setInterval(refresh, 3000); return () => clearInterval(id); }, [refresh]);

  const unread = messages.filter(m => !m.read).length;
  const filtered = filter === "all" ? messages : filter === "unread" ? messages.filter(m => !m.read) : messages.filter(m => m.read);

  function markRead(id: string) {
    const u = messages.map(m => m.id === id ? { ...m, read: true } : m);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(u)); refresh();
  }
  function del(id: string) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.filter(m => m.id !== id))); refresh();
  }
  function markAllRead() {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.map(m => ({ ...m, read: true })))); refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("Total", "الكل"), value: messages.length, cls: "border-border bg-card" },
          { label: t("Unread", "غير مقروء"), value: unread, cls: "border-primary/30 bg-primary/5" },
          { label: t("Read", "مقروء"), value: messages.length - unread, cls: "border-border bg-card" },
        ].map(s => (
          <Card key={s.label} className={s.cls}><CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.value === unread && unread > 0 ? "text-primary" : "text-foreground"}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /><h2 className="font-semibold">{t("Client Messages", "رسائل العملاء")}</h2></div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["all","unread","read"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  {f === "all" ? t("All","الكل") : f === "unread" ? t("Unread","غير مقروء") : t("Read","مقروء")}
                </button>
              ))}
            </div>
            {unread > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1 text-xs">
                <CheckCircle className="h-3 w-3" />{t("Mark all read", "تعليم الكل مقروء")}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("No messages yet", "لا توجد رسائل بعد")}</p>
              </motion.div>
            ) : filtered.map(msg => {
              const expanded = expandedId === msg.id;
              const date = new Date(msg.timestamp).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
              const ptLabel = PROJECT_TYPE_LABELS[msg.projectType];
              return (
                <motion.div key={msg.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className={`rounded-xl border p-4 transition-colors ${msg.read ? "border-border bg-card/50" : "border-primary/40 bg-primary/5"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{msg.name}</span>
                        {!msg.read && <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">{t("New","جديد")}</Badge>}
                        {ptLabel && <Badge variant="outline" className="text-xs px-2 py-0">{t(ptLabel.en, ptLabel.ar)}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!msg.read && (
                        <button onClick={() => markRead(msg.id)} title={t("Mark read","تعليم مقروء")}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setExpandedId(expanded ? null : msg.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button onClick={() => del(msg.id)} title={t("Delete","حذف")}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-border space-y-2 text-sm">
                          <div className="flex gap-2"><span className="text-muted-foreground shrink-0 w-14">{t("Phone","الهاتف")}:</span><span className="text-foreground">{msg.phone}</span></div>
                          <div className="flex gap-2"><span className="text-muted-foreground shrink-0 w-14">{t("Msg","الرسالة")}:</span><span className="text-foreground whitespace-pre-wrap">{msg.message}</span></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PROJECT FORM (add / edit)
════════════════════════════════════════════════════════ */
const EMPTY_PROJ = { titleEn:"", titleAr:"", descEn:"", descAr:"", tags:"", link:"", gradient: GRADIENTS[0].value, images: [] as string[] };

function ProjectForm({ initial, onSave, onCancel, t }: {
  initial?: Partial<Omit<typeof EMPTY_PROJ, "images"> & { id: string; images: string[] }>;
  onSave: () => void; onCancel: () => void;
  t: (en: string, ar: string) => string;
}) {
  const [form, setForm] = useState({ ...EMPTY_PROJ, ...initial, images: initial?.images ?? [] });
  const set = (k: keyof Omit<typeof EMPTY_PROJ, "images">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const base64 = ev.target?.result as string;
        setForm(f => ({ ...f, images: [...f.images, base64] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function moveImage(from: number, to: number) {
    setForm(f => {
      const imgs = [...f.images];
      const [removed] = imgs.splice(from, 1);
      imgs.splice(to, 0, removed);
      return { ...f, images: imgs };
    });
  }

  function handleSave() {
    if (!form.titleEn.trim() && !form.titleAr.trim()) return;
    const data = {
      titleEn: form.titleEn.trim(), titleAr: form.titleAr.trim(),
      descEn: form.descEn.trim(), descAr: form.descAr.trim(),
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      link: form.link.trim(), gradient: form.gradient,
      images: form.images,
    };
    if (initial?.id) { updateProject(initial.id, data); }
    else { saveProject(data); }
    window.dispatchEvent(new CustomEvent("portfolio-projects-changed"));
    onSave();
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormRow label={t("Title (English)", "العنوان (إنجليزي)")}>
          <Input placeholder="My Awesome Project" value={form.titleEn} onChange={set("titleEn")} />
        </FormRow>
        <FormRow label={t("Title (Arabic)", "العنوان (عربي)")}>
          <Input placeholder="مشروعي الرائع" value={form.titleAr} onChange={set("titleAr")} dir="rtl" />
        </FormRow>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormRow label={t("Description (EN)", "الوصف (إنجليزي)")}>
          <Textarea placeholder="Short description…" value={form.descEn} onChange={set("descEn")} className="min-h-[80px] resize-none" />
        </FormRow>
        <FormRow label={t("Description (AR)", "الوصف (عربي)")}>
          <Textarea placeholder="وصف مختصر…" value={form.descAr} onChange={set("descAr")} dir="rtl" className="min-h-[80px] resize-none" />
        </FormRow>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormRow label={t("Tags (comma separated)", "التاقات (مفصولة بفاصلة)")}>
          <Input placeholder="React, Firebase, Tailwind" value={form.tags} onChange={set("tags")} />
        </FormRow>
        <FormRow label={t("Project Link", "رابط المشروع")}>
          <Input placeholder="https://…" value={form.link} onChange={set("link")} />
        </FormRow>
      </div>

      {/* ─── Image Upload ─── */}
      <FormRow label={t("Project Images", "صور المشروع")}>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer w-fit px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 bg-background/50 hover:bg-background transition-colors text-sm text-muted-foreground hover:text-foreground">
            <ImageIcon className="h-4 w-4" />
            {t("Upload Images", "رفع صور")}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative group w-20 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {i > 0 && (
                      <button onClick={() => moveImage(i, i - 1)}
                        className="w-5 h-5 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
                        title={t("Move left","تقديم")}>
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                    )}
                    <button onClick={() => removeImage(i)}
                      className="w-5 h-5 rounded bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"
                      title={t("Remove","حذف")}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {i < form.images.length - 1 && (
                      <button onClick={() => moveImage(i, i + 1)}
                        className="w-5 h-5 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"
                        title={t("Move right","تأخير")}>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-primary/80 text-white py-0.5">
                      {t("Main","رئيسية")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{t("First image is the thumbnail. Hover to reorder or delete.", "الصورة الأولى هي الصورة الرئيسية. مرّر للترتيب أو الحذف.")}</p>
        </div>
      </FormRow>

      <FormRow label={t("Card Color", "لون البطاقة")}>
        <div className="flex flex-wrap gap-2">
          {GRADIENTS.map(g => (
            <button key={g.value} onClick={() => setForm(f => ({ ...f, gradient: g.value }))}
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${g.value} border-2 transition-all ${form.gradient === g.value ? "border-primary scale-110" : "border-border hover:border-primary/50"}`}
              title={g.label} />
          ))}
        </div>
      </FormRow>
      <div className="flex gap-2 pt-1">
        <Button onClick={handleSave} size="sm" className="gap-1"><Save className="h-4 w-4" />{t("Save", "حفظ")}</Button>
        <Button onClick={onCancel} variant="ghost" size="sm">{t("Cancel", "إلغاء")}</Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PROJECTS TAB
════════════════════════════════════════════════════════ */
function ProjectsTab() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [adding, setAdding]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = useCallback(() => setProjects(getProjects()), []);
  useEffect(() => { refresh(); }, [refresh]);

  function handleSave() { refresh(); setAdding(false); setEditingId(null); }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><FolderOpen className="h-5 w-5 text-primary" /><h2 className="font-semibold">{t("Projects", "المشاريع")}</h2></div>
        {!adding && (
          <Button size="sm" onClick={() => { setAdding(true); setEditingId(null); }} className="gap-1">
            <Plus className="h-4 w-4" />{t("Add Project", "إضافة مشروع")}
          </Button>
        )}
      </div>

      {adding && <ProjectForm t={t} onSave={handleSave} onCancel={() => setAdding(false)} />}

      {projects.length === 0 && !adding ? (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t("No projects yet. Add your first one!", "لا توجد مشاريع بعد. أضف أول مشروع!")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id}>
              {editingId === p.id ? (
                <ProjectForm t={t} initial={{ id: p.id, titleEn: p.titleEn, titleAr: p.titleAr, descEn: p.descEn, descAr: p.descAr, tags: p.tags.join(", "), link: p.link, gradient: p.gradient, images: p.images ?? [] }}
                  onSave={handleSave} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.gradient} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{p.titleEn || p.titleAr}</p>
                    {(p.titleAr && p.titleEn) && <p className="text-sm text-muted-foreground truncate" dir="rtl">{p.titleAr}</p>}
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">{p.tags.slice(0,4).map(tag => <Badge key={tag} variant="secondary" className="text-xs py-0">{tag}</Badge>)}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setEditingId(p.id); setAdding(false); }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => { deleteProject(p.id); refresh(); window.dispatchEvent(new CustomEvent("portfolio-projects-changed")); }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   REVIEWS TAB
════════════════════════════════════════════════════════ */
function ReviewsTab() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter]   = useState<"all" | "pending" | "approved">("all");

  const refresh = useCallback(() => setReviews(getReviews()), []);
  useEffect(() => { refresh(); const id = setInterval(refresh, 3000); return () => clearInterval(id); }, [refresh]);

  const pending  = reviews.filter(r => !r.approved).length;
  const approved = reviews.filter(r =>  r.approved).length;
  const filtered = filter === "all" ? reviews : filter === "pending" ? reviews.filter(r => !r.approved) : reviews.filter(r => r.approved);

  function approve(id: string) { approveReview(id); refresh(); window.dispatchEvent(new CustomEvent("portfolio-reviews-changed")); }
  function del(id: string) { deleteReview(id); refresh(); window.dispatchEvent(new CustomEvent("portfolio-reviews-changed")); }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("Total","الكل"), value: reviews.length, cls: "border-border bg-card" },
          { label: t("Pending","في الانتظار"), value: pending, cls: pending > 0 ? "border-secondary/40 bg-secondary/5" : "border-border bg-card" },
          { label: t("Approved","مقبول"), value: approved, cls: "border-border bg-card" },
        ].map(s => (
          <Card key={s.label} className={s.cls}><CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.value === pending && pending > 0 ? "text-secondary" : "text-foreground"}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" /><h2 className="font-semibold">{t("Client Reviews", "تقييمات العملاء")}</h2></div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["all","pending","approved"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {f === "all" ? t("All","الكل") : f === "pending" ? t("Pending","انتظار") : t("Approved","مقبول")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("No reviews yet", "لا توجد تقييمات بعد")}</p>
              </motion.div>
            ) : filtered.map(r => {
              const initials = r.name.trim().split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
              const date = new Date(r.timestamp).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
              return (
                <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className={`rounded-xl border p-4 transition-colors ${r.approved ? "border-border bg-card/50" : "border-secondary/40 bg-secondary/5"}`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border border-border shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{r.name}</span>
                        {r.role && <span className="text-sm text-muted-foreground">· {r.role}</span>}
                        <Badge variant={r.approved ? "secondary" : "outline"} className="text-xs px-2 py-0">
                          {r.approved ? t("Approved","مقبول") : t("Pending","انتظار")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRow value={r.rating} />
                        <span className="text-xs text-muted-foreground">{date}</span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{r.text}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!r.approved && (
                        <button onClick={() => approve(r.id)} title={t("Approve","قبول")}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => del(r.id)} title={t("Delete","حذف")}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STATS TAB
════════════════════════════════════════════════════════ */
function StatsTab() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<StatItem[]>(() => getStats());
  const [saved, setSaved] = useState(false);

  function update(id: string, field: keyof StatItem, value: string) {
    setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    setSaved(false);
  }

  function handleSave() {
    saveStats(stats);
    window.dispatchEvent(new CustomEvent("portfolio-stats-changed"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">{t("About Stats", "أرقام قسم من أنا")}</h2>
        </div>
        <Button size="sm" onClick={handleSave} className="gap-1">
          {saved
            ? <><CheckCircle className="h-4 w-4" />{t("Saved!", "تم!")}</>
            : <><Save className="h-4 w-4" />{t("Save All", "حفظ الكل")}</>
          }
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t("Edit the numbers shown in the About section of your portfolio.", "عدّل الأرقام التي تظهر في قسم «من أنا» من البورتفوليو.")}
      </p>

      <div className="space-y-4">
        {stats.map(stat => (
          <Card key={stat.id} className="border-border bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormRow label={t("Value (EN)", "القيمة (إنجليزي)")}>
                  <Input value={stat.valueEn} onChange={e => update(stat.id, "valueEn", e.target.value)} placeholder="50+" />
                </FormRow>
                <FormRow label={t("Value (AR)", "القيمة (عربي)")}>
                  <Input value={stat.valueAr} onChange={e => update(stat.id, "valueAr", e.target.value)} placeholder="+50" dir="rtl" />
                </FormRow>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormRow label={t("Label (EN)", "العنوان (إنجليزي)")}>
                  <Input value={stat.labelEn} onChange={e => update(stat.id, "labelEn", e.target.value)} />
                </FormRow>
                <FormRow label={t("Label (AR)", "العنوان (عربي)")}>
                  <Input value={stat.labelAr} onChange={e => update(stat.id, "labelAr", e.target.value)} dir="rtl" />
                </FormRow>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SETTINGS TAB
════════════════════════════════════════════════════════ */
function SettingsTab() {
  const { t, language, setLanguage } = useLanguage();
  const current = getAdminSettings();
  const [shortcutKey, setShortcutKey] = useState(current.shortcutKey);
  const [newUsername, setNewUsername] = useState(current.username);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCur, setShowCur]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConf, setShowConf]       = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [shortcutSaved, setShortcutSaved] = useState(false);
  const [credSaved, setCredSaved]         = useState(false);
  const [credError, setCredError]         = useState("");

  useEffect(() => {
    if (!isCapturing) return;
    function onKey(e: KeyboardEvent) {
      e.preventDefault();
      if (["Control","Shift","Alt","Meta"].includes(e.key)) return;
      setShortcutKey(e.key === " " ? "Space" : e.key);
      setIsCapturing(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCapturing]);

  function saveShortcut() {
    persistSettings({ ...getAdminSettings(), shortcutKey });
    setShortcutSaved(true); setTimeout(() => setShortcutSaved(false), 2000);
    window.dispatchEvent(new CustomEvent("admin-settings-changed"));
  }
  function saveCreds() {
    setCredError("");
    const s = getAdminSettings();
    if (currentPass !== s.password) { setCredError(t("Current password is incorrect.","كلمة المرور الحالية غير صحيحة.")); return; }
    if (newPass && newPass !== confirmPass) { setCredError(t("Passwords do not match.","كلمتا المرور غير متطابقتين.")); return; }
    if (newPass && newPass.length < 6) { setCredError(t("Password must be at least 6 characters.","كلمة المرور يجب أن تكون 6 أحرف على الأقل.")); return; }
    persistSettings({ ...s, username: newUsername || s.username, password: newPass || s.password });
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    setCredSaved(true); setTimeout(() => setCredSaved(false), 2000);
  }

  const displayShortcut = `Ctrl + Shift + ${shortcutKey || "?"}`;

  return (
    <div className="space-y-6">
      {/* Language toggle */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><Globe2 className="h-4 w-4 text-primary" />{t("Language", "اللغة")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-lg border border-border overflow-hidden w-fit">
            {(["en","ar"] as const).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)}
                className={`px-5 py-2 text-sm font-medium transition-colors ${language === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {lang === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard shortcut */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4 text-primary" />{t("Keyboard Shortcut","اختصار لوحة المفاتيح")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("Change the key combination that opens this panel.","غير الاختصار الذي يفتح هذه اللوحة.")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div onClick={() => setIsCapturing(true)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer select-none font-mono text-sm transition-colors
              ${isCapturing ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/50 text-foreground hover:border-primary/50"}`}>
            <span>{isCapturing ? t("Press any key…","اضغط أي مفتاح…") : displayShortcut}</span>
            <span className="text-xs text-muted-foreground">{isCapturing ? t("ESC to cancel","ESC للإلغاء") : t("Click to change","انقر للتغيير")}</span>
          </div>
          {isCapturing && <button onClick={() => setIsCapturing(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("Cancel","إلغاء")}</button>}
          <Button onClick={saveShortcut} size="sm" className="gap-2">
            {shortcutSaved ? <><CheckCircle className="h-4 w-4" />{t("Saved!","تم الحفظ!")}</> : <><Save className="h-4 w-4" />{t("Save Shortcut","حفظ الاختصار")}</>}
          </Button>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" />{t("Login Credentials","بيانات تسجيل الدخول")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("Update your admin username and password.","غير اسم المستخدم وكلمة المرور.")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormRow label={t("Username","اسم المستخدم")}>
            <div className="relative"><User className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 rtl:pr-10 rtl:pl-3" value={newUsername} onChange={e => setNewUsername(e.target.value)} /></div>
          </FormRow>
          <FormRow label={t("Current Password","كلمة المرور الحالية") + " *"}>
            <div className="relative"><Lock className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 rtl:pr-10 rtl:pl-3 pr-10" type={showCur ? "text" : "password"} value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
              <button type="button" onClick={() => setShowCur(v => !v)} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </FormRow>
          <FormRow label={t("New Password","كلمة مرور جديدة")}>
            <div className="relative"><Lock className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 rtl:pr-10 rtl:pl-3 pr-10" type={showNew ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
          </FormRow>
          {newPass && (
            <FormRow label={t("Confirm New Password","تأكيد كلمة المرور")}>
              <div className="relative"><Lock className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 rtl:pr-10 rtl:pl-3 pr-10" type={showConf ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                <button type="button" onClick={() => setShowConf(v => !v)} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </FormRow>
          )}
          {credError && <p className="text-sm text-destructive">{credError}</p>}
          <Button onClick={saveCreds} size="sm" className="gap-2">
            {credSaved ? <><CheckCircle className="h-4 w-4" />{t("Saved!","تم!")}</> : <><Save className="h-4 w-4" />{t("Save Credentials","حفظ البيانات")}</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════ */
type Tab = "messages" | "projects" | "reviews" | "stats" | "settings";

function Dashboard({ onLogout, onClose }: { onLogout: () => void; onClose: () => void }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("messages");

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "messages", icon: <MessageSquare className="h-4 w-4" />,  label: t("Messages","رسائل") },
    { id: "projects", icon: <FolderOpen className="h-4 w-4" />,     label: t("Projects","مشاريع") },
    { id: "reviews",  icon: <Star className="h-4 w-4" />,           label: t("Reviews","تقييمات") },
    { id: "stats",    icon: <LayoutDashboard className="h-4 w-4" />, label: t("Stats","إحصائيات") },
    { id: "settings", icon: <Settings className="h-4 w-4" />,        label: t("Settings","إعدادات") },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card shrink-0">
        {/* Close button — always on the left (entrance side of right panel) */}
        <button onClick={onClose}
          className="shrink-0 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-base leading-none truncate">{t("Admin Panel","لوحة التحكم")}</h1>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">Abdelrahman Mohamed</p>
          </div>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="sm" onClick={onLogout} className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{t("Sign Out","خروج")}</span>
        </Button>
      </div>

      <div className="flex border-b border-border shrink-0 bg-card overflow-x-auto">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${tab === tb.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tb.icon}{tb.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {tab === "messages" && <MessagesTab />}
            {tab === "projects" && <ProjectsTab />}
            {tab === "reviews"  && <ReviewsTab />}
            {tab === "stats"    && <StatsTab />}
            {tab === "settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════════════════ */
interface AdminPanelProps { open: boolean; onClose: () => void; }

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  function handleLogout() { sessionStorage.removeItem(SESSION_KEY); setLoggedIn(false); onClose(); }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-stretch"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="flex-1" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl h-full bg-background border-l border-border shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}>
            {!loggedIn
              ? (
                <div className="flex-1 flex items-center justify-center p-8 relative">
                  <button onClick={onClose}
                    className="absolute top-4 left-4 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <LoginForm onLogin={() => setLoggedIn(true)} />
                </div>
              )
              : <Dashboard onLogout={handleLogout} onClose={onClose} />
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
