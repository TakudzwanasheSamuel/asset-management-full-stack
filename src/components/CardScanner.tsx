"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, LoaderCircle, User, XCircle } from "lucide-react";
import { AnimatedScanner } from "./AnimatedScanner";
import { useToast } from "./ui/use-toast";

type UserData = { name: string; position: string | null; imageUrl: string | null; }
type ScanResult = { scanType: 'in' | 'out'; user: UserData; }
type Status = "idle" | "loading" | "success" | "error";

export function CardScanner() {
  const [cardId, setCardId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => { setStatus("idle"); setScanResult(null); }, 5000);
      return () => clearTimeout(timer);
    }
    if (status === 'idle') { inputRef.current?.focus(); }
  }, [status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cardId.length === 0 || status === "loading") return;

    setStatus("loading");
    setFeedbackMessage("Verifying Card ID...");
    try {
        const response = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setStatus("success");
        setScanResult(result);
    } catch (error) {
        setStatus("error");
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        setFeedbackMessage(message);
        toast({ variant: "destructive", title: "Scan Failed", description: message });
    } finally {
      setCardId("");
    }
  };

  const renderStatusIcon = () => {
      if (!scanResult) return null;
      const Icon = scanResult.scanType === 'in' ? LogIn : LogOut;
      const text = scanResult.scanType === 'in' ? 'Clocked In' : 'Clocked Out';
      const color = scanResult.scanType === 'in' ? 'text-green-600 dark:text-green-400 bg-green-500/10' : 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
      return (
        <div className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-full ${color}`}>
            <Icon className="h-5 w-5" />
            <p className="font-medium">{text}</p>
        </div>
      );
  };

  return (
    <Card className="w-full max-w-md shadow-lg min-h-[380px] flex items-center justify-center p-4">
      <div className="w-full text-center">
        {status === 'idle' && (
          <div className="animate-in fade-in-50">
            <CardHeader>
              <AnimatedScanner className="w-16 h-16 mx-auto mb-2" />
              <CardTitle className="text-2xl font-bold">Scan Your Card</CardTitle>
              <CardDescription>The system is ready for the next scan.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Input ref={inputRef} type="password" value={cardId} onChange={(e) => setCardId(e.target.value)} className="absolute -left-full" autoFocus />
                <div className="h-14 bg-secondary/50 rounded-md flex items-center justify-center text-xl font-mono tracking-widest text-muted-foreground border-2 border-dashed">
                  {cardId ? '*'.repeat(cardId.length) : 'Waiting for scan...'}
                </div>
              </form>
            </CardContent>
          </div>
        )}
        {status === 'loading' && <LoaderCircle className="w-16 h-16 text-primary animate-spin" />}
        {status === 'success' && scanResult?.user && (
          <div className="flex flex-col items-center justify-center animate-in fade-in-50">
            <Avatar className="w-24 h-24 mb-4 border-4 border-green-500"><AvatarImage src={scanResult.user.imageUrl || ''} /><AvatarFallback><User className="w-12 h-12" /></AvatarFallback></Avatar>
            <h3 className="text-3xl font-bold">{scanResult.user.name}</h3>
            <p className="text-xl text-muted-foreground">{scanResult.user.position}</p>
            {renderStatusIcon()}
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center animate-in fade-in-50">
            <div className="w-24 h-24 mb-4 rounded-full bg-destructive/10 flex items-center justify-center border-4 border-destructive"><XCircle className="w-12 h-12 text-destructive" /></div>
            <h3 className="text-3xl font-bold">Error</h3>
            <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-500/10 px-4 py-2 rounded-full"><p className="font-medium">{feedbackMessage}</p></div>
          </div>
        )}
      </div>
    </Card>
  );
}
