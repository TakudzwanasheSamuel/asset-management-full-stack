
import { RealTimeClock } from "@/components/RealTimeClock";
import { CardScanner } from "@/components/CardScanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedScanner } from "@/components/AnimatedScanner";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background font-body flex flex-col items-center justify-center p-4 selection:bg-primary/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Logo image */}
      <div className="flex flex-col items-center w-full mb-8">
        <img
          src="/AssetLogix-logo.png"
          alt="AssetLogix Logo"
          className="w-48 h-48 object-contain drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-12">
        <RealTimeClock />
        <CardScanner />
      </div>
    </main>
  );
}
