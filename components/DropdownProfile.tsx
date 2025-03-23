"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { BookCheck, ChartLine, LogOut, Settings, User } from "lucide-react"

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation";
import { getCurrentProfile } from "@/app/(user)/user_details/getProfile";
import { UUID } from "crypto";

type Profile = {
  id: UUID
  full_name: string;
  role: string;
  patronym: string;
  email: string;
  phone: number;
  number_id: string;
};

export function UserNav() {

  const { theme, setTheme } = useTheme()
  const router = useRouter();

  const handleRedirectDetails = () => {
    router.push('/user_details');
  };
  
  const handleRedirectForms = () => {
    router.push('/forms/submitted_forms');
  };

  const handleRedirectSettings = () => {
    router.push('/settings');
  };
  const handleRedirectDashboard = () => {
    router.push('/dash_proxeiro');
  };
  const handleRedirectOfficerForms = () => {
    router.push('/offi_forms');
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
      const getProfile = async () => {
      try {
        const profile = await getCurrentProfile();
        setFullName(profile?.full_name || "");
        setEmail(profile?.email || "");
        setRole(profile?.role || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
      getProfile();
    }, []);
    return (  
      <div>
      {fullName && (role == "user") && (   //Αν υπάρχει χρήστης εμφανισε το αν οχι μην

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback> {fullName[0]}{fullName.split(" ")[1]?.[0] || ""}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleRedirectDetails}>
                <User className="mr-2 h-4 w-4" />
                <span >Τα στοιχεία μου</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectForms}>
              <BookCheck className="mr-2 h-4 w-4" />
              <span >Συμπληρωμένες Φόρμες</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span >Ρυθμίσεις</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          
        </DropdownMenuContent>
      </DropdownMenu>
      )}

      {fullName && (role == "admin") && (   //Αν υπάρχει χρήστης εμφανισε το αν οχι μην
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback> {fullName[0]}{fullName.split(" ")[1]?.[0] || ""}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleRedirectDashboard}>
                <ChartLine className="mr-2 h-4 w-4" />
                <span >Πίνακας Ελέγχου</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectDetails}>
                <User className="mr-2 h-4 w-4" />
                <span >Τα στοιχεία μου</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span >Ρυθμίσεις</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
        </DropdownMenuContent>
      </DropdownMenu>
    )}
    {fullName && (role == "officer") && (   //Αν υπάρχει χρήστης εμφανισε το αν οχι μην
      <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback> {fullName[0]}{fullName.split(" ")[1]?.[0] || ""}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleRedirectOfficerForms}>
                      <ChartLine className="mr-2 h-4 w-4" />
                      <span >Φόρμες</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRedirectDetails}>
                      <User className="mr-2 h-4 w-4" />
                      <span >Τα στοιχεία μου</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRedirectSettings}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span >Ρυθμίσεις</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
              </DropdownMenuContent>
            </DropdownMenu>
    )}

      </div>
    )
  }