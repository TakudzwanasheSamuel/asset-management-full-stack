"use client";
import { useEffect, useState } from "react";
import { AssetStatusDistributionChart } from "@/components/dashboard/asset-status-chart";
import { AssetTypeDistributionChart } from "@/components/dashboard/asset-type-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, Clock, Package } from "lucide-react";

export default function DashboardPage() {
  const [totalAssets, setTotalAssets] = useState<string>("-");
  const [activeEmployees, setActiveEmployees] = useState<string>("-");
  const [pendingReturns, setPendingReturns] = useState<string>("-");
  const [totalValue, setTotalValue] = useState<string>("-");
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current user to get company_id
    fetch("/api/employees/me")
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        if (user && user.company_id) {
          setCompanyId(user.company_id);
        }
      });
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetch(`/api/assets/count?company_id=${companyId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.total === "number") {
          setTotalAssets(data.total.toLocaleString());
        }
      });
    fetch(`/api/employees/count?company_id=${companyId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.total === "number") {
          setActiveEmployees(data.total.toLocaleString());
        }
      });
    fetch(`/api/transactions/pending-returns?company_id=${companyId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.total === "number") {
          setPendingReturns(data.total.toLocaleString());
        }
      });
    fetch(`/api/assets/total-value?company_id=${companyId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.totalValue === "number") {
          setTotalValue(
            data.totalValue >= 1000000
              ? `$${(data.totalValue / 1000000).toFixed(2)}M`
              : data.totalValue >= 1000
              ? `$${(data.totalValue / 1000).toFixed(1)}K`
              : `$${data.totalValue.toLocaleString()}`
          );
        }
      });
  }, [companyId]);

  return (
    <div className="w-full px-4 space-y-8">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          icon={Package}
          description="All assets in inventory"
        />
        <StatsCard
          title="Active Employees"
          value={activeEmployees}
          icon={Users}
          description="Current active staff"
        />
        <StatsCard
          title="Pending Returns"
          value={pendingReturns}
          icon={Clock}
          description="Assets due for return"
          color="hsl(var(--destructive))"
        />
        <StatsCard
          title="Total Value"
          value={totalValue}
          icon={Package}
          description="Estimated current value"
        />
      </div>
      <div className="space-y-8 w-full">
        <RecentTransactions />
        <div className="grid w-full gap-8 md:grid-cols-2">
          <AssetStatusDistributionChart />
          <AssetTypeDistributionChart />
        </div>
      </div>
    </div>
  );
}
