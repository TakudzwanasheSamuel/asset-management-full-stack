"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Wand2, Loader2 } from "lucide-react";
import { validateAssetRegistration } from "@/ai/flows/asset-registration-validator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, "Asset name is required"),
  type: z.enum([
    "Laptop",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Phone",
    "Tablet",
    "Other",
  ]),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Other",
    },
  });

  const handleSuggest = async () => {
    const assetName = form.getValues("name");
    if (!assetName || assetName.length < 3) {
      form.trigger("name");
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await validateAssetRegistration({ assetName });
      const suggestions = result.suggestedProperties;
      
      if (suggestions) {
        if (suggestions.model) form.setValue("model", suggestions.model);
        if (suggestions.manufacturer) form.setValue("manufacturer", suggestions.manufacturer);
        if (suggestions.type && formSchema.shape.type.options.includes(suggestions.type as any)) {
            form.setValue("type", suggestions.type as any);
        }
        toast({ title: "AI Suggestions Applied", description: "We've filled in some details for you." });
      } else {
        toast({ title: "No suggestions found", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "AI Error", description: "Could not fetch AI suggestions.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const onSubmit = (values: RegistrationFormValues) => {
    setIsSubmitting(true);
    console.log(values);
    setTimeout(() => {
        setIsSubmitting(false);
        toast({ title: "Asset Registered", description: `${values.name} has been added to the inventory.` });
        form.reset();
    }, 1500)
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Asset Details</CardTitle>
        <CardDescription>
          Fill in the details of the new asset.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., MacBook Pro 16 M2" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="self-end">
                    <Button type="button" variant="outline" onClick={handleSuggest} disabled={isAiLoading}>
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                        Suggest with AI
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an asset type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {formSchema.shape.type.options.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField control={form.control} name="manufacturer" render={({ field }) => (
                    <FormItem><FormLabel>Manufacturer</FormLabel><FormControl><Input placeholder="e.g., Apple" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., A2780" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="serialNumber" render={({ field }) => (
                    <FormItem><FormLabel>Serial Number</FormLabel><FormControl><Input placeholder="C02G86R4Q6L4" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                    <FormItem><FormLabel>Purchase Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                    <FormItem><FormLabel>Purchase Price ($)</FormLabel><FormControl><Input type="number" placeholder="2499.00" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional details about the asset..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Asset
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
