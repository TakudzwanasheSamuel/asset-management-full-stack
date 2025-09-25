import { RealTimeClock } from "@/components/RealTimeClock";
import { CardScanner } from "@/components/CardScanner";

export default function CheckInOutPage() {
  return (
    <>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-12">
        <RealTimeClock />
        <CardScanner />
      </div>
    </>
  );
}
