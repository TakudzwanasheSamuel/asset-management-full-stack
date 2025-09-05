import type { Transaction } from "@/lib/types";
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

const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    assetId: "asset_123",
    assetName: "MacBook Pro 16",
    employeeId: "emp_456",
    employeeName: "Alice Johnson",
    type: "Check-Out",
    date: new Date(2023, 10, 28, 9, 15),
    condition: "Excellent",
    createdBy: "user_789",
    createdAt: new Date(),
  },
  {
    id: "txn_2",
    assetId: "asset_789",
    assetName: "Dell Monitor U2721DE",
    employeeId: "emp_123",
    employeeName: "Bob Williams",
    type: "Check-In",
    date: new Date(2023, 10, 28, 8, 45),
    condition: "Good",
    createdBy: "user_789",
    createdAt: new Date(),
  },
  {
    id: "txn_3",
    assetId: "asset_456",
    assetName: "Logitech MX Master 3",
    employeeId: "emp_789",
    employeeName: "Charlie Brown",
    type: "Check-Out",
    date: new Date(2023, 10, 27, 14, 30),
    condition: "Excellent",
    createdBy: "user_012",
    createdAt: new Date(),
  },
    {
    id: "txn_4",
    assetId: "asset_101",
    assetName: "iPhone 15 Pro",
    employeeId: "emp_234",
    employeeName: "Diana Prince",
    type: "Check-Out",
    date: new Date(2023, 10, 27, 11, 0),
    condition: "Excellent",
    createdBy: "user_789",
    createdAt: new Date(),
  },
  {
    id: "txn_5",
    assetId: "asset_202",
    assetName: "iPad Air",
    employeeId: "emp_567",
    employeeName: "Ethan Hunt",
    type: "Check-In",
    date: new Date(2023, 10, 26, 17, 0),
    condition: "Fair",
    createdBy: "user_012",
    createdAt: new Date(),
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A log of the latest asset check-ins and check-outs.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {mockTransactions.map((transaction) => (
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
                  {format(transaction.date, "PPpp")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
