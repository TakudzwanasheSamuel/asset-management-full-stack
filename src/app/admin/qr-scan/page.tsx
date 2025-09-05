import { ScannerUI } from "@/components/scanner/scanner-ui";

export default function QrScanPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
                <p className="text-muted-foreground">
                    Scan a QR code or enter details manually to record a transaction.
                </p>
            </div>
            <ScannerUI />
        </div>
    );
}
