import { EmployeeList } from "@/components/employees/employee-list";

export default function EmployeesPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
                <p className="text-muted-foreground">
                    View and manage all employees in the organization.
                </p>
            </div>
            <EmployeeList />
        </div>
    );
}
