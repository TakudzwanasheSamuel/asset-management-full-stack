"use client";

import { useState, useEffect } from "react";
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
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEmployeeDialog } from "./add-employee-dialog";

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => { throw new Error(err.message || "Failed to fetch employees") });
        }
        return res.json();
      })
      .then((data) => {
        setEmployees(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredEmployees = employees.filter(
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
        {loading ? (
          <div className="p-4 text-center">Loading employees...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No employees found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>{employee.hireDate ? format(new Date(employee.hireDate), "PPP") : "-"}</TableCell>
                    <TableCell className="text-right">
                      <AddEmployeeDialog employee={employee}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </AddEmployeeDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </div>
    </div>
  );
}
