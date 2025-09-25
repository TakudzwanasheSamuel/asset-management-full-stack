"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, LoaderCircle, User, XCircle } from "lucide-react";
import { AnimatedScanner } from "./AnimatedScanner";
import { useToast } from "@/hooks/use-toast";

type UserData = { name: string; position: string | null }
type AssetScan = { id: number; name: string; status: string; assignedTo: number | null; assignedName: string | null } | null;
type ScanResult = { scanType?: 'in' | 'out'; user?: UserData; asset?: AssetScan };
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
  if (!response.ok) {
    // API returns { message, asset: null } with 404
    setStatus('error');
    setScanResult(result);
    throw new Error(result.message);
  }

  // success: result may contain asset or user
  setStatus("success");
  setScanResult({ asset: result.asset ?? null, user: result.user ?? undefined, scanType: result.scanType });
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
    if (scanResult.asset) {
      return (
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
            <p className="font-medium">Asset: {scanResult.asset.name}</p>
            {scanResult.asset.assignedName && (
              <p className="text-sm text-muted-foreground">Assigned to: {scanResult.asset.assignedName}</p>
            )}
          </div>
        </div>
      );
    }

    // If asset is explicitly null, show not recognized message
    if (scanResult.asset === null) {
      return (
        <div className="mt-4 px-4 py-2 rounded-full bg-red-50 text-red-700">
          <p className="font-medium">Tag not recognized</p>
          <p className="text-sm text-muted-foreground">No asset matched this NFC/RFID tag.</p>
        </div>
      );
    }

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
        <CardHeader>
          <AnimatedScanner className="w-16 h-16 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold">Scan Your Card</CardTitle>
          <CardDescription>The system is ready for the next scan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input
              ref={inputRef}
              type="password"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full text-center text-xl font-mono tracking-widest mb-2"
              autoFocus
              placeholder="Scan here"
              disabled={status === 'loading'}
            />
            {status === 'loading' && <LoaderCircle className="w-8 h-8 text-primary animate-spin mx-auto mt-2" />}
            {status === 'error' && (
              <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-500/10 px-4 py-2 rounded-full justify-center">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">{feedbackMessage}</span>
              </div>
            )}
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center animate-in fade-in-50 mt-4">
                {/* if we have user info, show it */}
                {scanResult?.user ? (
                  <>
                    <Avatar className="w-24 h-24 mb-4 border-4 border-green-500">
                      <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
                    </Avatar>
                    <h3 className="text-3xl font-bold">{scanResult.user.name}</h3>
                    <p className="text-xl text-muted-foreground">{scanResult.user.position}</p>
                  </>
                ) : null}

                {/* if we have an asset, show asset info */}
                {scanResult?.asset ? (
                  <div className="mt-4">
                    <div className="px-4 py-2 rounded-full bg-muted text-muted-foreground">
                      <p className="font-medium">Asset: {scanResult.asset.name}</p>
                      {scanResult.asset.assignedName && (
                        <p className="text-sm text-muted-foreground">Assigned to: {scanResult.asset.assignedName}</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* if asset explicitly null and no user, show not recognized */}
                {scanResult?.asset === null && !scanResult?.user ? (
                  <div className="mt-4 px-4 py-2 rounded-full bg-red-50 text-red-700">
                    <p className="font-medium">Tag not recognized</p>
                    <p className="text-sm text-muted-foreground">No asset matched this NFC/RFID tag.</p>
                  </div>
                ) : null}

                {renderStatusIcon()}
              </div>
            )}
          </form>
        </CardContent>
      </div>
    </Card>
  );
}
