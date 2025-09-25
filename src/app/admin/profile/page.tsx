"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
// ...existing code...

export default function ProfilePage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // ...existing state and hooks...
  // ...existing code...
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: e.target.value });
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees/me", {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete account");
      toast({ title: "Account deleted", description: "Your account has been deleted." });
      window.location.href = "/";
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    phoneNumber: "",
    department: "",
    role: "",
    employeeId: "",
    status: "Active",
    hireDate: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    phoneNumber: "",
    department: "",
    role: "",
    employeeId: "",
    status: "Active",
    hireDate: ""
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/employees/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            avatar: data.avatar || "",
            phoneNumber: data.phoneNumber || "",
            department: data.department || "",
            role: data.role || "",
            employeeId: data.employeeId || "",
            status: data.status || "Active",
            hireDate: data.hireDate ? data.hireDate.slice(0, 10) : ""
          });
          setForm({
            name: data.name,
            email: data.email,
            password: "",
            avatar: data.avatar || "",
            phoneNumber: data.phoneNumber || "",
            department: data.department || "",
            role: data.role || "",
            employeeId: data.employeeId || "",
            status: data.status || "Active",
            hireDate: data.hireDate ? data.hireDate.slice(0, 10) : ""
          });
          setAvatarPreview(data.avatar ? `/uploads/${data.avatar}` : "");
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setForm({ ...form, avatar: file.name });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarFileName = form.avatar;
      // If avatarPreview is set and file input has a file, upload it
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("avatar", file);
        const uploadRes = await fetch("/api/employees/me/avatar", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Failed to upload avatar");
        avatarFileName = uploadData.filename;
      }
      const res = await fetch("/api/employees/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatar: avatarFileName }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update profile");
      setProfile({
        name: result.name,
        email: result.email,
        avatar: result.avatar,
        phoneNumber: result.phoneNumber || "",
        department: result.department || "",
        role: result.role || "",
        employeeId: result.employeeId || "",
        status: result.status || "Active",
        hireDate: result.hireDate ? result.hireDate.slice(0, 10) : ""
      });
      setEditing(false);
      toast({ title: "Profile updated", description: "Your profile has been updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account details and password.</p>
      </div>
      <div className="bg-card rounded-lg shadow p-6 w-full max-w-2xl mx-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="flex flex-col items-center gap-2 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || (profile.avatar ? `/uploads/${profile.avatar}` : "")} alt="avatar" />
                <AvatarFallback>{profile.name ? profile.name[0] : "U"}</AvatarFallback>
              </Avatar>
              {editing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="mt-2"
                    placeholder="Upload avatar"
                    title="Upload avatar"
                  />
                </>
              )}
            </div>
            <hr className="my-6 border-t border-muted" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input name="name" value={form.name} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input name="email" value={form.email} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <Input name="department" value={form.department} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <Input name="role" value={form.role} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Employee ID</label>
                <Input name="employeeId" value={form.employeeId} onChange={handleChange} disabled={!editing} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select name="status" value={form.status} onChange={handleSelectChange} disabled={!editing} className="w-full border rounded px-2 py-1" title="Status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Hire Date</label>
                <Input name="hireDate" type="date" value={form.hireDate} onChange={handleChange} disabled={!editing} />
              </div>
            </div>
            <hr className="my-6 border-t border-muted" />
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <Input name="password" type="password" value={form.password} onChange={handleChange} disabled={!editing} placeholder="Leave blank to keep current password" />
            </div>
            <div className="flex gap-2 mt-4">
              {editing ? (
                <>
                  <Button type="submit" disabled={loading}>Save</Button>
                  <Button type="button" variant="ghost" onClick={() => { setEditing(false); setForm({ ...form, name: profile.name, email: profile.email, password: "", avatar: profile.avatar }); setAvatarPreview(profile.avatar ? `/uploads/${profile.avatar}` : ""); }}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button type="button" onClick={e => { e.preventDefault(); setEditing(true); }}>Edit Profile</Button>
                  <Button type="button" variant="destructive" onClick={e => { e.preventDefault(); setShowDeleteDialog(true); }}>Delete Account</Button>
                </>
              )}
            </div>
            {showDeleteDialog && (
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                  <div className="bg-card rounded-lg shadow p-6 w-full max-w-sm mx-auto">
                    <h2 className="text-lg font-bold mb-2">Delete Account</h2>
                    <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>Delete</Button>
                    </div>
                  </div>
                </div>
              </Dialog>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
