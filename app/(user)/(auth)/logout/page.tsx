"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LogoutPage =  () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(()=> router.push("./"), 2000);
    }, []);
    
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
    <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Αποσύνδεση...
          </AlertDescription>
        </Alert>
    </div>
  );
};

export default LogoutPage;