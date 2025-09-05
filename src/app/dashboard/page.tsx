import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
  Package,
  PackageCheck,
  PackageX,
  Wrench,
  Users,
  Clock,
} from "lucide-react";

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
          title="Checked Out"
          value="312"
          icon={PackageX}
          description="+180.1% from last month"
          color="hsl(var(--destructive))"
        />
        <StatsCard
          title="Available"
          value="890"
          icon={PackageCheck}
          description="+19% from last month"
          color="hsl(142.1 76.2% 36.3%)"
        />
        <StatsCard
          title="In Maintenance"
          value="52"
          icon={Wrench}
          description="+4 since last week"
          color="hsl(var(--primary))"
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <RecentTransactions />
         </div>
         <div className="space-y-4">
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
         </div>
      </div>
    </div>
  );
}
