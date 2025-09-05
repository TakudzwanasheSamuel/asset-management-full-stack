"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Camera, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ScannerUI() {
  const [time, setTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate transaction
    setTimeout(() => {
        setIsSubmitting(false);
        toast({
            title: "Transaction Successful",
            description: "Asset has been checked in/out successfully.",
        });
        (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Asset Transaction</CardTitle>
                <CardDescription>Scan or enter details to proceed.</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted">
                <Clock className="h-4 w-4" />
                <span>{time ? time.toLocaleTimeString() : "..."}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="scan">
            <div className="mt-4 aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="h-16 w-16 mb-4" />
              <p className="font-medium">Camera view not available</p>
              <p className="text-sm">QR Code scanning is a prototype feature.</p>
               <Button className="mt-4" variant="secondary">Simulate Scan</Button>
            </div>
          </TabsContent>
          <TabsContent value="manual">
            <form onSubmit={handleManualSubmit} className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetId">Asset ID</Label>
                  <Input id="assetId" placeholder="ASSET-12345" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" placeholder="EMP-67890" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <RadioGroup defaultValue="good" className="flex space-x-4" required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">Excellent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair">Fair</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor">Poor</Label>
                  </div>
                </RadioGroup>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="e.g. Minor scratch on the back" />
                </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check-In
                </Button>
                <Button type="submit" variant="outline" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check-Out
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
