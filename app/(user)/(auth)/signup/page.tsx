"use client";

import React, { useEffect } from 'react'
import { SignupForm } from './components/SignUpForm'
import { createClient } from "@/utils/supabase/client";
import { signout } from '@/lib/auth-actions';

const SignUpPage = () => {

  const supabase = createClient();
  
    useEffect(() => {
        
        const signOutttt = async () => {
          const { data: { user } } = await supabase.auth.getUser()  //Αποσύνδεση όταν πάει στο login
          if (user) {                                                 //Αν υπάρχει χρήστης
            signout();
          }
        };
    
        signOutttt();
      }, []);

  return (
    <div className="flex h-svh items-center"><SignupForm/></div>
  )
}

export default SignUpPage