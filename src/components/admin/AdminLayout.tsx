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
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-border/50 border-e transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
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
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                collapsed && "justify-center px-0"
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
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="flex items-center justify-between gap-4 border-b bg-white px-6 py-4">
          <div><p className="font-semibold text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.role}</p></div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
              <Languages className="h-4 w-4 text-primary" />
              <span className="sr-only">Interface language</span>
              <select value={locale} onChange={(event) => changeLanguage(event.target.value)} className="h-9 cursor-pointer bg-transparent font-semibold outline-none" aria-label="Interface language">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </label>
            <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground">{t("logout")}</button>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
