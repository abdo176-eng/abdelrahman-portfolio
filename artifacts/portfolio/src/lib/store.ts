/* ─── Central localStorage store for portfolio dynamic data ─── */

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
