"use client";

import { useState } from "react";
import type { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegistrationForm } from "./registration-form";
import { useToast } from "@/hooks/use-toast";

export function AssetActions({ asset }: { asset: Asset }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/assets/${asset.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete asset");
      toast({
        title: "Asset Deleted",
        description: `${asset.name} has been removed from the inventory.`,
      });
      // Optionally refresh asset list
      window.location.reload();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete asset.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AlertDialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Asset
                </DropdownMenuItem>
              </DialogTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Asset
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update the details for {asset.name}.
              </DialogDescription>
            </DialogHeader>
            <RegistrationForm
              asset={asset}
              onSuccess={() => setIsEditDialogOpen(false)}
              form={{ control: {}, handleSubmit: (fn: any) => fn }}
              onSubmit={() => {}}
            />
          </DialogContent>
        </Dialog>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              asset "{asset.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
