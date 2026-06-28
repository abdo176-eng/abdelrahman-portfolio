import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, LogOut, Mail, CheckCircle, Trash2, Eye, EyeOff,
  Lock, User, LayoutDashboard, MessageSquare, Clock,
  ChevronDown, ChevronUp, Settings, Save, KeyRound, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ─── Storage keys ─── */
const SESSION_KEY  = "admin_session";
const MESSAGES_KEY = "contact_messages";
const SETTINGS_KEY = "admin_settings";

/* ─── Default settings ─── */
interface AdminSettings {
  username: string;
  password: string;
  shortcutKey: string; // single digit/char, used with Ctrl+Shift
}

const DEFAULT_SETTINGS: AdminSettings = {
  username:    "admin",
  password:    "Abdo1662006",
  shortcutKey: "6",
};

export function getAdminSettings(): AdminSettings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: AdminSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/* ─── Messages helpers ─── */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function saveMessage(msg: Omit<ContactMessage, "id" | "timestamp" | "read">) {
  const existing: ContactMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
  const newMsg: ContactMessage = {
    ...msg,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([newMsg, ...existing]));
}

function getMessages(): ContactMessage[] {
  return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
}

function markRead(id: string) {
  const msgs = getMessages().map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
}

function deleteMsg(id: string) {
  const msgs = getMessages().filter(m => m.id !== id);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
}

const PROJECT_LABELS: Record<string, string> = {
  company: "Company Website", ecommerce: "E-Commerce",
  landing: "Landing Page", other: "Other",
};

/* ═══════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════ */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [error, setError]        = useState("");
  const [loading, setLoading]    = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const s = getAdminSettings();
      if (username === s.username && password === s.password) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center w-full h-full"
    >
      <Card className="w-full max-w-sm border-border bg-card shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your portfolio</p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input data-testid="input-admin-username" className="pl-10" placeholder="admin"
                  value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input data-testid="input-admin-password" className="pl-10 pr-10"
                  type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button data-testid="button-admin-login" type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGE CARD
═══════════════════════════════════════════ */
function MessageCard({ msg, onRefresh }: { msg: ContactMessage; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(msg.timestamp).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`rounded-xl border ${msg.read ? "border-border bg-card/50" : "border-primary/40 bg-primary/5"} p-4 transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground">{msg.name}</span>
            {!msg.read && <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">New</Badge>}
            <Badge variant="outline" className="text-xs px-2 py-0">{PROJECT_LABELS[msg.projectType] || msg.projectType}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!msg.read && (
            <button onClick={() => { markRead(msg.id); onRefresh(); }} title="Mark as read"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setExpanded(v => !v)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button onClick={() => { deleteMsg(msg.id); onRefresh(); }} title="Delete"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-border space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-muted-foreground w-16 shrink-0">Phone:</span><span className="text-foreground">{msg.phone}</span></div>
              <div className="flex gap-2"><span className="text-muted-foreground w-16 shrink-0">Message:</span><span className="text-foreground whitespace-pre-wrap">{msg.message}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGES TAB
═══════════════════════════════════════════ */
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const refresh = useCallback(() => setMessages(getMessages()), []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  const unread   = messages.filter(m => !m.read).length;
  const filtered = filter === "all" ? messages : filter === "unread" ? messages.filter(m => !m.read) : messages.filter(m => m.read);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-card"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-3xl font-bold text-foreground mt-1">{messages.length}</p>
        </CardContent></Card>
        <Card className="border-primary/30 bg-primary/5"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="text-3xl font-bold text-primary mt-1">{unread}</p>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Read</p>
          <p className="text-3xl font-bold text-foreground mt-1">{messages.length - unread}</p>
        </CardContent></Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Client Messages</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["all", "unread", "read"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  {f}
                </button>
              ))}
            </div>
            {unread > 0 && (
              <Button variant="outline" size="sm" className="text-xs gap-1"
                onClick={() => { const u = getMessages().map(m => ({ ...m, read: true })); localStorage.setItem(MESSAGES_KEY, JSON.stringify(u)); refresh(); }}>
                <CheckCircle className="h-3 w-3" /> Mark all read
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
                <p className="text-sm">No messages yet</p>
              </motion.div>
            ) : filtered.map(msg => <MessageCard key={msg.id} msg={msg} onRefresh={refresh} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════════ */
function SettingsTab() {
  const current = getAdminSettings();

  const [shortcutKey, setShortcutKey]     = useState(current.shortcutKey);
  const [newUsername, setNewUsername]     = useState(current.username);
  const [currentPass, setCurrentPass]     = useState("");
  const [newPass, setNewPass]             = useState("");
  const [confirmPass, setConfirmPass]     = useState("");
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [shortcutSaved, setShortcutSaved] = useState(false);
  const [credSaved, setCredSaved]         = useState(false);
  const [credError, setCredError]         = useState("");
  const [isCapturing, setIsCapturing]     = useState(false);

  /* Capture shortcut key from keyboard */
  useEffect(() => {
    if (!isCapturing) return;
    function onKey(e: KeyboardEvent) {
      e.preventDefault();
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      setShortcutKey(e.key === " " ? "Space" : e.key);
      setIsCapturing(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCapturing]);

  function saveShortcut() {
    const s = getAdminSettings();
    saveSettings({ ...s, shortcutKey });
    setShortcutSaved(true);
    setTimeout(() => setShortcutSaved(false), 2000);
    window.dispatchEvent(new CustomEvent("admin-settings-changed"));
  }

  function saveCredentials() {
    setCredError("");
    const s = getAdminSettings();
    if (currentPass !== s.password) { setCredError("Current password is incorrect."); return; }
    if (newPass && newPass !== confirmPass) { setCredError("New passwords do not match."); return; }
    if (newPass && newPass.length < 6) { setCredError("New password must be at least 6 characters."); return; }
    saveSettings({ ...s, username: newUsername || s.username, password: newPass || s.password });
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    setCredSaved(true);
    setTimeout(() => setCredSaved(false), 2000);
  }

  const displayShortcut = shortcutKey ? `Ctrl + Shift + ${shortcutKey}` : "— not set —";

  return (
    <div className="space-y-6">
      {/* ── Keyboard Shortcut ── */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-primary" /> Keyboard Shortcut
          </CardTitle>
          <p className="text-sm text-muted-foreground">Change the key combination that opens this panel.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current shortcut</label>
            <div
              onClick={() => setIsCapturing(true)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-colors select-none font-mono text-sm
                ${isCapturing ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/50 text-foreground hover:border-primary/50"}`}>
              <span>{isCapturing ? "Press any key…" : displayShortcut}</span>
              <span className="text-xs text-muted-foreground">{isCapturing ? "ESC to cancel" : "Click to change"}</span>
            </div>
            {isCapturing && (
              <button onClick={() => setIsCapturing(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            )}
          </div>
          <Button onClick={saveShortcut} className="gap-2" size="sm">
            {shortcutSaved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Shortcut</>}
          </Button>
        </CardContent>
      </Card>

      {/* ── Credentials ── */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" /> Login Credentials
          </CardTitle>
          <p className="text-sm text-muted-foreground">Update your admin username and password.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="admin" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Password <span className="text-destructive">*</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 pr-10" type={showCurrent ? "text" : "password"} value={currentPass}
                onChange={e => setCurrentPass(e.target.value)} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">New Password <span className="text-muted-foreground text-xs">(leave blank to keep current)</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 pr-10" type={showNew ? "text" : "password"} value={newPass}
                onChange={e => setNewPass(e.target.value)} placeholder="New password" />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {newPass && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 pr-10" type={showConfirm ? "text" : "password"} value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat new password" />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          {credError && <p className="text-sm text-destructive font-medium">{credError}</p>}
          <Button onClick={saveCredentials} className="gap-2" size="sm">
            {credSaved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Credentials</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD (tabs: Messages | Settings)
═══════════════════════════════════════════ */
type Tab = "messages" | "settings";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("messages");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-none">Admin Panel</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Abdelrahman Mohamed</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border shrink-0 bg-card">
        <button onClick={() => setTab("messages")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === "messages" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <MessageSquare className="h-4 w-4" /> Messages
        </button>
        <button onClick={() => setTab("settings")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === "settings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <Settings className="h-4 w-4" /> Settings
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {tab === "messages" ? <MessagesTab /> : <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════ */
interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
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
            className="w-full max-w-2xl h-full bg-background border-l border-border shadow-2xl flex flex-col relative"
            onClick={e => e.stopPropagation()}>
            <button data-testid="button-admin-close" onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
            {!loggedIn
              ? <div className="flex-1 flex items-center justify-center p-8"><LoginForm onLogin={() => setLoggedIn(true)} /></div>
              : <Dashboard onLogout={handleLogout} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
