

import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type RegistrationFormProps = {
  asset?: any;
  onSuccess?: () => void;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  form: any;
  onSubmit: any;
};

// Dummy data for illustration
const ASSET_TYPES = ["Laptop", "Desktop", "Monitor", "Phone", "Tablet"];
const STATUS_OPTIONS = ["Available"];
const employees = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

import { useForm } from "react-hook-form";

export function RegistrationForm({ asset, onSuccess, isEditMode = false, isSubmitting = false, form, onSubmit }: RegistrationFormProps) {
  // Provide default form and onSubmit if not passed
  const internalForm = useForm({ 
    defaultValues: { 
      name: "", 
      type: "", 
      status: "", 
      assignedTo: "unassigned", 
      manufacturer: "", model: "", serialNumber: "", purchaseDate: "", purchasePrice: "", nfcId: "", rfid: "", description: "" } });
  const handleSubmit = (data: any) => {
    if (onSubmit) {
      return onSubmit(data);
    }
    // Default form submission logic here
    console.log('Form submitted:', data);
  };
  
  const usedForm = form || internalForm;

  return (
    <Form {...usedForm}>
      <form onSubmit={usedForm.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-6 !pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={usedForm.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="e.g., MacBook Pro 16 M2" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {ASSET_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="assignedTo" render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To <span className="text-muted-foreground">(optional)</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="manufacturer" render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="e.g., Apple" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="model" render={({ field }) => (
              <FormItem>
                <FormLabel>Model <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="e.g., A2780" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="serialNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="C02G86R4Q6L4" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="purchaseDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="purchasePrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price ($) <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input type="number" placeholder="2499.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="nfcId" render={({ field }) => (
              <FormItem>
                <FormLabel>NFC ID <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl><Input placeholder="NFC sticker/tag ID" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={usedForm.control} name="rfid" render={({ field }) => (
              <FormItem>
                <FormLabel>RFID Tag <span className="text-muted-foreground">(optional)</span></FormLabel>
                <FormControl><Input placeholder="RFID tag value" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={usedForm.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional details about the asset..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Save Changes" : "Register Asset"}
            </Button>
          </CardFooter>
        </CardContent>
      </form>
    </Form>
  );
}
