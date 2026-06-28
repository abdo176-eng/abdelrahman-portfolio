import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Mail, CheckCircle, Trash2, Eye, EyeOff, Lock, User, LayoutDashboard, MessageSquare, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ADMIN_USER = "admin";
const ADMIN_PASS = "Abdo1662006";
const SESSION_KEY = "admin_session";
const MESSAGES_KEY = "contact_messages";

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

function deleteMessage(id: string) {
  const msgs = getMessages().filter(m => m.id !== id);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  company: "Company Website",
  ecommerce: "E-Commerce Store",
  landing: "Landing Page",
  other: "Other",
};

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
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
                <Input
                  data-testid="input-admin-username"
                  className="pl-10"
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="input-admin-password"
                  className="pl-10 pr-10"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button
              data-testid="button-admin-login"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MessageCard({ msg, onRefresh }: { msg: ContactMessage; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);

  function handleRead() {
    markRead(msg.id);
    onRefresh();
  }

  function handleDelete() {
    deleteMessage(msg.id);
    onRefresh();
  }

  const date = new Date(msg.timestamp).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`rounded-xl border ${msg.read ? "border-border bg-card/50" : "border-primary/40 bg-primary/5"} p-4 transition-colors`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground">{msg.name}</span>
            {!msg.read && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">New</Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0">
              {PROJECT_TYPE_LABELS[msg.projectType] || msg.projectType}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!msg.read && (
            <button
              onClick={handleRead}
              title="Mark as read"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            title={expanded ? "Collapse" : "Expand"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-16 shrink-0">Phone:</span>
                <span className="text-foreground">{msg.phone}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-16 shrink-0">Message:</span>
                <span className="text-foreground whitespace-pre-wrap">{msg.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const refresh = useCallback(() => {
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  const unreadCount = messages.filter(m => !m.read).length;
  const filtered = filter === "all" ? messages : filter === "unread" ? messages.filter(m => !m.read) : messages.filter(m => m.read);

  function handleMarkAllRead() {
    const updated = getMessages().map(m => ({ ...m, read: true }));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    refresh();
  }

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-3xl font-bold text-foreground mt-1">{messages.length}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-3xl font-bold text-primary mt-1">{unreadCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="text-3xl font-bold text-foreground mt-1">{messages.length - unreadCount}</p>
            </CardContent>
          </Card>
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
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                </motion.div>
              ) : (
                filtered.map(msg => (
                  <MessageCard key={msg.id} msg={msg} onRefresh={refresh} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="admin-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-stretch"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="ml-auto w-full max-w-2xl h-full bg-background border-l border-border shadow-2xl flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              data-testid="button-admin-close"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!loggedIn ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <LoginForm onLogin={() => setLoggedIn(true)} />
              </div>
            ) : (
              <Dashboard onLogout={handleLogout} />
            )}
          </motion.div>

          <div className="flex-1" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
