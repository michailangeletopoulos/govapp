"use client";

import React, { Suspense, useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/utils/supabase/client";

const LoginContent = () => {
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'

  // Έβαλα κάθε φορά που ο χρήστης πηγαίνει στο log in να γίνεται sign out, 
  // επειδή με την αλλαγή του password το verification link έκανε τον χρήστη να συνδέεται αυτόματα.

  const supabase = createClient();

  useEffect(() => {
      // Fetch the profiles data when the component mounts
      const signOut = async () => {
        const { error } = await supabase.auth.signOut()
      };
  
      signOut();
    }, []);


  return (

    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      {resetSuccess && (
        <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Ο κωδικός σας άλλαξε με επιτυχία. Μπορείτε να συνδεθείτε με τα νέα στοιχεία σας.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm/>
      </div>
    
  )
}

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};
export default LoginPage;