"use client";

import { useEffect, useState } from "react";

// Trace: module loaded
if (typeof window !== 'undefined') {
  // only log in browser
  // eslint-disable-next-line no-console
  console.debug('[trace] use-employees module loaded');
}

export interface EmployeeOption {
  id: string;
  name: string;
}

export function useEmployees() {
  // eslint-disable-next-line no-console
  console.debug('[trace] useEmployees hook called');
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  useEffect(() => {
    let mounted = true;
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setEmployees(
          Array.isArray(data) ? data.map((e) => ({ id: e.id, name: e.name })) : []
        );
      })
      .catch((err) => {
        console.error("Failed to load employees", err);
        if (mounted) setEmployees([]);
      });
    return () => {
      mounted = false;
    };
  }, []);
  return employees;
}
