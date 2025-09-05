import { cn } from "@/lib/utils";
export function AnimatedScanner({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-10 h-10", className)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
            <div className="absolute left-[15%] right-[15%] h-0.5 bg-primary/80 shadow-[0_0_10px] shadow-primary animate-scan rounded-full"></div>
        </div>
    );
}
