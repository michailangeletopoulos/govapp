"use client";

import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import NavbarAdmin from "./NavbarAdmin";
import Navbar from "./Navbar";

import { getProfileRole } from "../(user)/user_details/getProfile";

const NavbarSwitcher = () => {
    var profileRole;
    //profileRole = "user";
    const supabase = createClient();

    useEffect(() => {
        // Fetch the role when component mounts
        

        // Listen for auth changes (sign-in/sign-out)
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === "SIGNED_OUT" || !session) {
              profileRole = "user";
            } else if (event === "SIGNED_IN") {
              profileRole = getProfileRole();// Fetch role when user signs in
            }
          }
        );
    
        // Cleanup listener on unmount
        authListener.subscription.unsubscribe()
      }, []);

/*
      const supabase = createClient()

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            profileRole = "user";
          } else if (event === "SIGNED_IN") {
            profileRole = getProfileRole();// Fetch role when user signs in
          }
        }
      );
  
      // Cleanup listener on unmount
      authListener.subscription.unsubscribe()*/

      if (profileRole == "admin") {
        return <NavbarAdmin />;
      } else if (profileRole == "user") {
        return <Navbar />;
      }


  return (
    <div>NavbarSwitcher</div>
  )
}

export default NavbarSwitcher