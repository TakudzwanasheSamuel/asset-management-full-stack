import { AssetStatusDistributionChart } from "@/components/dashboard/asset-status-chart";
import { AssetTypeDistributionChart } from "@/components/dashboard/asset-type-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, Clock, Package } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value="1,254"
          icon={Package}
          description="+20.1% from last month"
        />
        <StatsCard
            title="Active Employees"
            value="238"
            icon={Users}
            description="+5 since last month"
        />
        <StatsCard
            title="Pending Returns"
            value="12"
            icon={Clock}
            description="2 are overdue"
            color="hsl(var(--destructive))"
        />
         <StatsCard
            title="Total Value"
            value="$1.5M"
            icon={Package}
            description="Estimated current value"
        />
      </div>
      <div className="space-y-8">
        <RecentTransactions />
        <div className="grid gap-8 md:grid-cols-2">
            <AssetStatusDistributionChart />
            <AssetTypeDistributionChart />
        </div>
      </div>
    </div>
  );
}
