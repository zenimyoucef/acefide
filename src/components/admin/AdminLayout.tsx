"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  BookOpen,
  Handshake,
  Users,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "@/lib/navigation";
import type { SessionUser } from "@/lib/auth";
import Image from "next/image";
import logo from "../../../assets/acefide.png";

const sidebarItems = [
  { key: "dashboard", icon: LayoutDashboard, href: "/admin" },
  { key: "news", icon: Newspaper, href: "/admin/news" },
  { key: "events", icon: Calendar, href: "/admin/events" },
  { key: "studies", icon: FileText, href: "/admin/studies" },
  { key: "publications", icon: BookOpen, href: "/admin/publications" },
  { key: "partners", icon: Handshake, href: "/admin/partners" },
  { key: "team", icon: Users, href: "/admin/team" },
  { key: "members", icon: Users, href: "/admin/members" },
  { key: "consultations", icon: MessageSquare, href: "/admin/consultations" },
  { key: "messages", icon: MessageSquare, href: "/admin/messages" },
  { key: "subscribers", icon: Mail, href: "/admin/subscribers" },
  { key: "content", icon: Settings, href: "/admin/content" },
];

export function AdminLayout({ children, user }: { children: React.ReactNode; user: SessionUser }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div
      className={cn(
        "admin-shell min-h-screen bg-muted/30 flex",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {mobileOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden" />}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex h-dvh w-[min(18rem,86vw)] flex-col border-e border-border/50 bg-card shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center">
              <Image src={logo} alt="ACEFIDE logo" width={32} height={32} className="object-cover" />
            </div>
            {!collapsed && (
              <span className="font-bold text-foreground text-lg">ACEFIDE</span>
            )}
          </div>
          <button type="button" onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                collapsed && "lg:justify-center lg:px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.key === "team" ? (locale === "ar" ? "فريق العمل" : locale === "fr" ? "Équipe" : "Team") : t(item.key)}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-border/50">
          <button
            type="button"
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-white/95 px-3 py-3 backdrop-blur sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white text-primary lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground sm:text-base">{user.name}</p><p className="truncate text-[0.65rem] text-muted-foreground sm:text-xs">{user.role}</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
              <Languages className="hidden h-4 w-4 text-primary sm:block" />
              <span className="sr-only">Interface language</span>
              <select value={locale} onChange={(event) => changeLanguage(event.target.value)} className="h-9 cursor-pointer bg-transparent font-semibold outline-none" aria-label="Interface language">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <button onClick={logout} className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">{t("logout")}</button>
          </div>
        </header>
        <div className="p-3 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
