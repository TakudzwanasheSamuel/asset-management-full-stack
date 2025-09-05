"use client";

import { useState } from "react";
import type { Employee } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockEmployees: Employee[] = [
  { id: 'emp_456', name: 'Alice Johnson', email: 'alice.j@example.com', department: 'Engineering', role: 'Software Engineer', employeeId: 'E456', status: 'Active', hireDate: new Date('2021-08-01'), createdAt: new Date(), updatedAt: new Date(), avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'emp_123', name: 'Bob Williams', email: 'bob.w@example.com', department: 'Product', role: 'Product Manager', employeeId: 'E123', status: 'Active', hireDate: new Date('2020-03-15'), createdAt: new Date(), updatedAt: new Date(), avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'emp_789', name: 'Charlie Brown', email: 'charlie.b@example.com', department: 'Marketing', role: 'Marketing Specialist', employeeId: 'E789', status: 'Active', hireDate: new Date('2022-06-20'), createdAt: new Date(), updatedAt: new Date(), avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'emp_234', name: 'Diana Prince', email: 'diana.p@example.com', department: 'Design', role: 'UX/UI Designer', employeeId: 'E234', status: 'Inactive', hireDate: new Date('2019-11-01'), createdAt: new Date(), updatedAt: new Date(), avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 'emp_567', name: 'Ethan Hunt', email: 'ethan.h@example.com', department: 'Sales', role: 'Sales Director', employeeId: 'E567', status: 'Terminated', hireDate: new Date('2018-02-10'), createdAt: new Date(), updatedAt: new Date(), avatar: 'https://picsum.photos/100/100?random=5' },
];

export function EmployeeList() {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredEmployees = mockEmployees.filter(
        (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeVariant = (status: Employee["status"]) => {
        switch (status) {
            case "Active": return "secondary";
            case "Inactive": return "outline";
            case "Terminated": return "destructive";
            default: return "default";
        }
    };

  return (
    <div className="space-y-4">
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar} data-ai-hint="person avatar" />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(employee.status)}>{employee.status}</Badge>
                </TableCell>
                <TableCell>{format(employee.hireDate, "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
    </div>
  );
}
