
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Printer } from 'lucide-react';

function LabelsPageContent() {
  const searchParams = useSearchParams();
  const assetData = searchParams.get('assets');
  let assets: { id: string; name: string }[] = [];

  if (assetData) {
    try {
      assets = JSON.parse(assetData);
    } catch (error) {
      console.error('Failed to parse asset data:', error);
      // Handle error state appropriately
    }
  }
  
  const handlePrint = () => {
    window.print();
  };


  return (
    <div>
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Print Asset Labels</h1>
                <p className="text-muted-foreground">
                    Print QR code labels for your selected assets.
                </p>
            </div>
            <Button onClick={handlePrint}>
                <Printer className="mr-2" />
                Print
            </Button>
        </div>
      
        {assets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-2">
                {assets.map((asset) => (
                <Card key={asset.id} className="text-center p-4 break-inside-avoid">
                    <CardContent className="p-0 space-y-4">
                        <div className="bg-white p-4 rounded-md">
                             <QRCode
                                value={JSON.stringify({ assetId: asset.id })}
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{asset.id}</div>
                    </CardContent>
                </Card>
                ))}
            </div>
        ) : (
             <Card className="text-center p-12">
                <h3 className="text-xl font-semibold">No assets selected</h3>
                <p className="text-muted-foreground mt-2">
                    Please go back to the assets list and select at least one asset to generate labels.
                </p>
             </Card>
        )}
         <style jsx global>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                main, header, aside {
                    display: none !important;
                }
                .print-container {
                    display: block !important;
                    margin: 0;
                    padding: 0;
                }
                @page {
                    size: auto;
                    margin: 0.5in;
                }
            }
        `}</style>
    </div>
  );
}

export default function LabelsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="print-container">
                <LabelsPageContent />
            </div>
        </Suspense>
    )
}
