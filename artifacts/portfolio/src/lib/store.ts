/* ─── Central localStorage store for portfolio dynamic data ─── */

/* ══ Stats ══ */
export interface StatItem {
  id: string;
  valueEn: string;
  valueAr: string;
  labelEn: string;
  labelAr: string;
}

const STATS_KEY = "portfolio_stats";

const DEFAULT_STATS: StatItem[] = [
  { id: "technologies", valueEn: "15+", valueAr: "+15", labelEn: "Technologies",        labelAr: "تقنيات مستخدمة" },
  { id: "experience",   valueEn: "4+",  valueAr: "+4",  labelEn: "Years Experience",    labelAr: "سنوات خبرة" },
  { id: "clients",      valueEn: "30+", valueAr: "+30", labelEn: "Happy Clients",       labelAr: "عملاء سعداء" },
  { id: "projects",     valueEn: "50+", valueAr: "+50", labelEn: "Projects Completed",  labelAr: "مشاريع مكتملة" },
];

export function getStats(): StatItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY) || "null");
    return saved && saved.length ? saved : DEFAULT_STATS;
  } catch { return DEFAULT_STATS; }
}

export function saveStats(stats: StatItem[]) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/* ══ Projects ══ */
export interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  tags: string[];
  link: string;
  gradient: string;
  images: string[];   // base64 data URLs
  createdAt: string;
}

const PROJECTS_KEY = "portfolio_projects";

export function getProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]"); } catch { return []; }
}

export function saveProject(p: Omit<Project, "id" | "createdAt">): Project {
  const list = getProjects();
  const newP: Project = { ...p, id: Date.now().toString(), createdAt: new Date().toISOString() };
  localStorage.setItem(PROJECTS_KEY, JSON.stringify([...list, newP]));
  return newP;
}

export function updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt">>) {
  const list = getProjects().map(p => p.id === id ? { ...p, ...data } : p);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
}

export function deleteProject(id: string) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(getProjects().filter(p => p.id !== id)));
}

/* ══ Reviews ══ */
export interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  timestamp: string;
  approved: boolean;
}

const REVIEWS_KEY = "portfolio_reviews";

export function getReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]"); } catch { return []; }
}

export function submitReview(r: Omit<Review, "id" | "timestamp" | "approved">): Review {
  const list = getReviews();
  const newR: Review = { ...r, id: Date.now().toString(), timestamp: new Date().toISOString(), approved: false };
  localStorage.setItem(REVIEWS_KEY, JSON.stringify([newR, ...list]));
  return newR;
}

export function approveReview(id: string) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(getReviews().map(r => r.id === id ? { ...r, approved: true } : r)));
}

export function deleteReview(id: string) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(getReviews().filter(r => r.id !== id)));
}

export function getApprovedReviews(): Review[] {
  return getReviews().filter(r => r.approved);
}
