import { RecentTransactions } from "@/components/dashboard/recent-transactions";

export default function TransactionsPage() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">A log of the latest asset check-ins and check-outs.</p>
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}
