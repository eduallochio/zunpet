"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Activity,
  BarChart3,
  Store,
  Globe,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Usuários", icon: Users },
  { href: "/dashboard/pets", label: "Pets", icon: PawPrint },
  { href: "/dashboard/activity", label: "Atividade", icon: Activity },
  { href: "/dashboard/analytics", label: "Análises", icon: BarChart3 },
  { href: "/dashboard/stores", label: "Lojas", icon: Store },
  { href: "/dashboard/landing", label: "Landing Page", icon: Globe },
  { href: "/dashboard/deletions", label: "Exclusões", icon: Trash2 },
];

const bottomItems = [
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 gap-3">
        <Image
          src="/icon.png"
          alt="Zupet"
          width={32}
          height={32}
          className="rounded-xl flex-shrink-0"
        />
        <span className="font-heading font-700 text-lg tracking-tight text-foreground">
          Zupet
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          admin
        </span>
      </div>

      <Separator className="opacity-50" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-3 py-2">
          Navegação
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="opacity-50" />

      {/* Bottom */}
      <div className="p-3 space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sair
        </button>
      </div>

      {/* Admin indicator */}
      <Separator className="opacity-50" />
      <div className="p-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">A</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate">Administrador</p>
          <p className="text-[10px] text-muted-foreground truncate">Zupet Dashboard</p>
        </div>
      </div>
    </aside>
  );
}
