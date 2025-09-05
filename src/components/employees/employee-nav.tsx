"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmployeeNav() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <div className="flex justify-between items-center mb-4">
            <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Button>Add Employee</Button>
        </div>
    );
}
