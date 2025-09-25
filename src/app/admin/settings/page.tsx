"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [company, setCompany] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      try {
        const res = await fetch("/api/companies/me");
        if (!res.ok) throw new Error("Failed to fetch company details");
        const data = await res.json();
  setCompany({ name: data.name || "", address: data.address || "" });
      } catch (err) {
        toast({ title: "Error", description: "Could not load company details." });
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/companies/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: company.name, address: company.address }),
      });
      if (!res.ok) throw new Error("Failed to update company details");
      toast({ title: "Saved", description: "Company details updated." });
    } catch (err) {
      toast({ title: "Error", description: "Could not save company details." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-2xl bg-white dark:bg-muted rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Company Settings</h1>
        <p className="text-muted-foreground mb-6">Edit your company information below.</p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <Input
              value={company.name}
              onChange={e => setCompany({ ...company, name: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={company.address}
              onChange={e => setCompany({ ...company, address: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving || loading} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
