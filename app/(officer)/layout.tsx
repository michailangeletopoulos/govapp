import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import NavbarOfficer from "../components/NavbarOfficer";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import NavbarSwitcher from "../components/NavbarSwitcher";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin interface",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <NavbarOfficer/>
      <main className="relative overflow-hidden">
        {children}
      </main>
      <Footer/>
      
      </body>
    </html>
  );
}
