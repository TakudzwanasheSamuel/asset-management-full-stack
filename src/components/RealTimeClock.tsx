"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
export function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedTime = time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '00:00:00 AM';
  const formattedDate = time ? time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading date...';
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card/50 w-full text-center shadow-inner">
      <div className="flex items-center gap-3 text-primary mb-2"><Clock className="w-6 h-6" /><h2 className="text-xl font-medium text-foreground/80">Current Time</h2></div>
      <div className="text-5xl md:text-6xl font-bold text-foreground font-mono tracking-tighter">{formattedTime}</div>
      <p className="text-lg text-muted-foreground mt-2">{formattedDate}</p>
    </div>
  );
}
