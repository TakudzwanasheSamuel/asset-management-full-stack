"use client";
import type { Transaction } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";




export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A log of the latest asset check-ins and check-outs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center">Loading transactions...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.assetName}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.assetId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.employeeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.employeeId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "Check-In"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PPpp")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
