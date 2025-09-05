"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Package,
  LayoutDashboard,
  QrCode,
  PackagePlus,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/check-in-out",
    label: "Check-in/Out",
    icon: QrCode,
  },
  {
    href: "/admin/assets/register",
    label: "Register Asset",
    icon: PackagePlus,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">EquiTrack</span>
          </div>
        </SidebarHeader>
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <span>
                    <item.icon />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu className="p-2">
           <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton asChild tooltip="Log Out">
                    <span>
                        <LogOut />
                        <span>Log Out</span>
                    </span>
                </SidebarMenuButton>
              </Link>
           </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
