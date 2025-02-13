import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "sonner"


import { getProfileRole } from "./user_details/getProfile";
import NavbarAdmin from "../components/NavbarAdmin";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import NavbarSwitcher from "../components/NavbarSwitcher";
import { ThemeProvider } from "@/components/ui/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Psifiopoihsh",
  description: "Psifiopoihsh stoixeion ptyxiakh",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
/*
  const userOrAdmin = await getProfileRole(); // Fetch user data

  if (userOrAdmin=="admin") {
    return (
      <html lang="en">
        <body className={inter.className}>
        <NavbarAdmin/>
        <main className="relative overflow-hidden">
          {children}
        </main>
       
        
        </body>
      </html>
    );
  }
*/

  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar/>
          <main className="relative overflow-hidden">
            {children}
            <Toaster />
          </main>
          <br></br>
          <br></br>
          <Footer/>
      </ThemeProvider>
      
      </body>
    </html>
  );
}
