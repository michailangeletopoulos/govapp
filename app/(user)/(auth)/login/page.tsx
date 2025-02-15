"use client";

import React, { Suspense, useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { redirect, useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/utils/supabase/client";
import { redirectingLoginSuccess, signout } from '@/lib/auth-actions';
import { revalidatePath } from 'next/cache';

const LoginContent = () => {
  const searchParams = useSearchParams()
  const resetSuccess = searchParams.get('reset') === 'success'
  const needLoginPage = searchParams.get('need_logIn') === 'true'
  const wrongPassEmail = searchParams.get('wrong_PassEmail') === 'true'
  const verifyAccount = searchParams.get('verifyAccount') === 'wrong'
  const resetSuccessAlreadyLogIn = searchParams.get('reset') === 'successwithlogin'

  // Έβαλα κάθε φορά που ο χρήστης πηγαίνει στο log in να γίνεται sign out, 
  // επειδή με την αλλαγή του password το verification link έκανε τον χρήστη να συνδέεται αυτόματα.
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      if (!resetSuccessAlreadyLogIn) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          signout();
        }
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.log(error);
          redirect("/error");
        }
        redirectingLoginSuccess();
      }
    };
  
    signOut();
  }, [resetSuccessAlreadyLogIn]); // Depend on the variable
  

  /*
  if (!resetSuccessAlreadyLogIn) {

  useEffect(() => {
      
      const signOutttt = async () => {
        const { data: { user } } = await supabase.auth.getUser()  //Αποσύνδεση όταν πάει στο login
        if (user) {                                                 //Αν υπάρχει χρήστης
          signout();
        }
      };
  
      signOutttt();
    }, []);
  }
  else {
    useEffect(() => {
      
      const signOuttt = async () => {
        const { error } = await supabase.auth.signOut();
          if (error) {
            console.log(error);
            redirect("/error");
          }
        redirectingLoginSuccess();
      };
  
      signOuttt();
    }, []);
  }*/

  return (

    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      {resetSuccess && (
        <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Ο κωδικός σας άλλαξε με επιτυχία. Μπορείτε να συνδεθείτε με τα νέα στοιχεία σας.
          </AlertDescription>
        </Alert>
      )}
      {needLoginPage && (
        <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Πρέπει να συνδεθείτε για να δείτε αυτή την σελίδα.
          </AlertDescription>
        </Alert>
      )}
      {wrongPassEmail && (
        <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Βεβαιωθείτε ότι έχετε επιβεβαιώσει τον λογαριασμό σας, αλλιώς
            ο κωδικός ή το email που καταχωρήσατε είναι λάθος, προσπαθήστε ξανά
            ή αν δεν θυμάστε τον κωδικό πατήστε το  Ξεχάσατε τον κωδικό? 
          </AlertDescription>
        </Alert>
      )}
      {verifyAccount && (
        <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Ελέξτε το email σας, σας έχει σταλεί μήνυμα επιβεβαίωσης.
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