"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Users,
  PackagePlus,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/assets", label: "Assets", icon: Archive },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/assets/register", label: "Register", icon: PackagePlus },
  { href: "/admin/check-in-out", label: "Scan", icon: ScanLine },
];

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-card p-2 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {menuItems.map((item) => {
           const isActive = pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' || pathname === item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center p-2 rounded-md text-sm font-medium",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
