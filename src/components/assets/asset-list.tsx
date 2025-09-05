
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Asset } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AssetActions } from "./asset-actions";
import { QrCode } from "lucide-react";

const mockAssets: Asset[] = [
  { id: 'asset_123', name: 'MacBook Pro 16', type: 'Laptop', status: 'Checked Out', serialNumber: 'C02G86R4Q6L4', purchaseDate: new Date('2022-01-15'), purchasePrice: 2499, location: 'HQ-101', assignedTo: 'emp_456', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Apple', model: 'A2485' },
  { id: 'asset_789', name: 'Dell Monitor U2721DE', type: 'Monitor', status: 'Available', serialNumber: 'SN789XYZ', purchaseDate: new Date('2021-11-20'), purchasePrice: 599, location: 'Storage', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Dell', model: 'U2721DE' },
  { id: 'asset_456', name: 'Logitech MX Master 3', type: 'Mouse', status: 'Available', serialNumber: 'SN456ABC', purchaseDate: new Date('2023-03-10'), purchasePrice: 99, location: 'Storage', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Logitech', model: 'MX Master 3' },
  { id: 'asset_101', name: 'iPhone 15 Pro', type: 'Phone', status: 'Checked Out', serialNumber: 'SN101DEF', purchaseDate: new Date('2023-09-22'), purchasePrice: 999, location: 'Remote', assignedTo: 'emp_234', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Apple', model: 'A2848' },
  { id: 'asset_202', name: 'iPad Air', type: 'Tablet', status: 'In Repair', serialNumber: 'SN202GHI', purchaseDate: new Date('2022-05-30'), purchasePrice: 599, location: 'IT Department', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Apple', model: 'A2588' },
  { id: 'asset_303', name: 'Herman Miller Aeron', type: 'Other', status: 'Retired', serialNumber: 'SN303JKL', purchaseDate: new Date('2018-07-19'), purchasePrice: 1200, location: 'Archive', createdAt: new Date(), updatedAt: new Date(), manufacturer: 'Herman Miller', model: 'Aeron' },
];


export function AssetList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const router = useRouter();

  const filteredAssets = mockAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets((prev) => [...prev, assetId]);
    } else {
      setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
    }
  };

  const handleGenerateLabels = () => {
    const assetsToPrint = mockAssets
        .filter(asset => selectedAssets.includes(asset.id))
        .map(asset => ({ id: asset.id, name: asset.name }));
    const assetData = JSON.stringify(assetsToPrint);
    router.push(`/admin/assets/labels?assets=${encodeURIComponent(assetData)}`);
  };
  
  const getStatusBadgeVariant = (status: Asset["status"]) => {
    switch (status) {
      case "Available": return "secondary";
      case "Checked Out": return "default";
      case "In Repair": return "destructive";
      case "Maintenance": return "outline";
      case "Retired": return "outline";
      default: return "default";
    }
  };


  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Input
                placeholder="Search by name, serial, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            {selectedAssets.length > 0 && (
                <Button onClick={handleGenerateLabels}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate Labels ({selectedAssets.length})
                </Button>
            )}
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead padding="checkbox">
                      <Checkbox
                        checked={selectedAssets.length > 0 && selectedAssets.length === filteredAssets.length}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAssets.map((asset) => (
                <TableRow key={asset.id} data-state={selectedAssets.includes(asset.id) && "selected"}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedAssets.includes(asset.id)}
                            onCheckedChange={(checked) => handleSelectAsset(asset.id, Boolean(checked))}
                            aria-label={`Select asset ${asset.name}`}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(asset.status)}>{asset.status}</Badge>
                    </TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{format(asset.purchaseDate, "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <AssetActions asset={asset} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
