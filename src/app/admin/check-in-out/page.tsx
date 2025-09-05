import { RealTimeClock } from "@/components/RealTimeClock";
import { CardScanner } from "@/components/CardScanner";

export default function CheckInOutPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Check-in / Check-out</h1>
            <p className="text-muted-foreground">
                Scan an ID card to record a transaction.
            </p>
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-12">
            <RealTimeClock />
            <CardScanner />
        </div>
    </div>
  );
}
