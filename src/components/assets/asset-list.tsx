"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { AssetActions } from "./asset-actions";

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
  const filteredAssets = mockAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        <Input
            placeholder="Search by name, serial, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
        />
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
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
                <TableRow key={asset.id}>
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
