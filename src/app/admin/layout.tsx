import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col w-full">
          <DashboardHeader />
          <main className="flex-1 w-full px-2 sm:px-4 bg-background mb-16 md:mb-0">
            {children}
          </main>
          <DashboardBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
