import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import NavbarAdmin from "../components/NavbarAdmin";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <NavbarAdmin/>
      <main className="relative overflow-hidden">
        {children}
        <Toaster />
      </main>
      <Footer/>
      
      </body>
    </html>
  );
}
