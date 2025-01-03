"use client";
import React from 'react'
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from '@/lib/auth-actions';

const SignInWithGoogleButton = () => {
    return (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Συνδεθείτε με Google
        </Button>
      );
}

export default SignInWithGoogleButton