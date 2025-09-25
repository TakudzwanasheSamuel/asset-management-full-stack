import type { ReactNode } from "react";

export default function CheckInOutPlainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-background font-body flex flex-col items-center justify-center p-4 selection:bg-primary/20">
      {children}
    </main>
  );
}
