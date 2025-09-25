"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  company_id: string;
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [company, setCompany] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Fetch current user info (assume /api/employees/me returns user info including company_id)
    fetch("/api/employees/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setUser(data);
          if (data.company_id) {
            fetch(`/api/companies/${data.company_id}`)
              .then((res) => res.ok ? res.json() : null)
              .then((companyData) => {
                if (companyData) setCompany(companyData);
              });
          }
        }
      });
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex" />
        {company && (
          <span className="ml-4 text-lg font-semibold text-primary">{company.name}</span>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              {user && user.avatar ? (
                <AvatarImage src={`/uploads/${user.avatar}`} alt={user.name} />
              ) : (
                <AvatarImage src="" alt="default avatar" />
              )}
              <AvatarFallback>{user ? user.name[0] : "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user ? user.name : "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user ? user.email : ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/admin/profile" passHref>
            <DropdownMenuItem asChild>
              <span className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href="/" passHref>
             <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
