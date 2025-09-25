"use client";
import { RegistrationForm } from "@/components/assets/registration-form";

export default function RegisterAssetPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Register New Asset</h1>
                <p className="text-muted-foreground">
                    Add a new asset to the inventory.
                </p>
            </div>
            <RegistrationForm />
        </div>
    );
}
