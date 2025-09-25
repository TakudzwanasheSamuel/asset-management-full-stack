"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { useEmployees } from "./use-employees";
import { toast } from "@/hooks/use-toast";

export function AssignAssetDialog({ assetId, onAssigned }: { assetId: string; onAssigned?: () => void }) {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const employees = useEmployees();

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast({ title: "Please select an employee." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/assets/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, employeeId: selectedEmployee })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to assign asset");
      }
      toast({ title: "Asset assigned successfully!" });
      setOpen(false);
      onAssigned?.();
    } catch (e) {
      toast({ title: "Failed to assign asset.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Assign</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Asset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp: { id: string; name: string }) => (
                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleAssign} disabled={loading}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
