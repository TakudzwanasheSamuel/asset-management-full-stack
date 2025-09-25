"use client";
import { AssetList } from "@/components/assets/asset-list";

export default function AssetsPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Asset Inventory</h1>
                <p className="text-muted-foreground">
                    Browse, search, and manage all assets in the system.
                </p>
            </div>
            <AssetList />
        </div>
    );
}
