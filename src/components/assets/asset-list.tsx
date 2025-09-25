"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Asset, Employee } from "@/lib/types";
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
import { AssignAssetDialog } from "./assign-asset-dialog";
import { QrCode } from "lucide-react";

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
      Promise.all([
        fetch("/api/assets").then((res) => {
          if (!res.ok) throw new Error("Failed to fetch assets");
          return res.json();
        }),
        fetch("/api/employees").then((res) => {
          if (!res.ok) throw new Error("Failed to fetch employees");
          return res.json();
        })
      ])
        .then(([assetsData, employeesData]) => {
          setAssets(Array.isArray(assetsData) ? assetsData : assetsData.assets || []);
          setEmployees(Array.isArray(employeesData) ? employeesData : employeesData.employees || []);
          setError(null);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  const filteredAssets = assets.filter(
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
    const assetsToPrint = assets
      .filter((asset) => selectedAssets.includes(asset.id))
      .map((asset) => ({ id: asset.id, name: asset.name }));
    const assetData = JSON.stringify(assetsToPrint);
    router.push(`/admin/assets/labels?assets=${encodeURIComponent(assetData)}`);
  };

  const getStatusBadgeVariant = (status: Asset["status"]) => {
    switch (status) {
      case "Available":
        return "secondary";
      case "Checked Out":
        return "default";
      case "In Repair":
        return "destructive";
      case "Maintenance":
        return "outline";
      case "Retired":
        return "outline";
      default:
        return "default";
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
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin/assets/register')} variant="default">
            Register Asset
          </Button>
          {selectedAssets.length > 0 && (
            <Button onClick={handleGenerateLabels}>
              <QrCode className="mr-2 h-4 w-4" />
              Generate Labels ({selectedAssets.length})
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading assets...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedAssets.length > 0 &&
                      selectedAssets.length === filteredAssets.length
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(Boolean(checked))
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  data-state={
                    selectedAssets.includes(asset.id) && "selected"
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={(checked) =>
                        handleSelectAsset(asset.id, Boolean(checked))
                      }
                      aria-label={`Select asset ${asset.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {asset.assignedTo
                      ? (employees.find(e => e.id === asset.assignedTo)?.name || "")
                      : ""}
                  </TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>
                    {format(new Date(asset.purchaseDate), "PPP")}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <AssetActions asset={asset} />
                    <AssignAssetDialog assetId={asset.id} onAssigned={() => {
                      // Refresh assets after assignment
                      setLoading(true);
                      fetch("/api/assets")
                        .then((res) => res.json())
                        .then((assetsData) => {
                          setAssets(Array.isArray(assetsData) ? assetsData : assetsData.assets || []);
                          setError(null);
                        })
                        .catch((err) => setError(err.message))
                        .finally(() => setLoading(false));
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
