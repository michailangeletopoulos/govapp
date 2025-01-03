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
import { LogOut, User, Settings, ChartLine } from "lucide-react"

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

  const { setTheme } = useTheme()
  const router = useRouter();

  const handleRedirectDetails = () => {
    router.push('/user_details');
  };
  
  const handleRedirectDashboard = () => {
    router.push('/dashboard');
  };

  const handleRedirectSettings = () => {
    router.push('/settings');
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
      const getProfile = async () => {
      try {
        const profile = await getCurrentProfile();
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
  
      getProfile();
    }, []);

    return (
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
                <span >Dashboard</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectDetails}>
                <User className="mr-2 h-4 w-4" />
                <span >Τα στοιχεία μου</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRedirectSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span >Ρυθμίσεις</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }