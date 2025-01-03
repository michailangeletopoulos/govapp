"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';

import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createClient } from "@/utils/supabase/client";

import { redirect } from "next/navigation";
import { getCurrentProfile, updateCurrentProfile } from './getProfile';
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),
    patronym: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.coerce.number().int(),
    number_id: z.string().min(2).max(50)
  })

const Page = () => {

  //const userData = getCurrentProfile()

  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    /*  name: userData?.full_name || '',
      surname: userData?.patronym || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      number_id: userData?.number_id || '' */

      name: "",
      patronym: "",
      email: "",
      phone: 0,
      number_id: "" 
    }, 
  })

  const { setValue } = form;
  useEffect(() => {
    const fetchUserData = async () => {
        const userData = await getCurrentProfile(); // Fetch user data

        // Update form default values dynamically
        setValue('name', userData?.full_name || '');
        setValue('patronym', userData?.patronym || '');
        setValue('email', userData?.email || '');
        setValue('phone', userData?.phone || '');
        setValue('number_id', userData?.number_id || '');

        setLoading(false); // Stop loading once data is fetched
    };

    fetchUserData();
  }, [setValue]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

/*
  async function get_user_details() {
    const supabase = createClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error fetching session:', sessionError.message);
  }

  const session = sessionData?.session;

  if (!session) {
    console.log("No active session found.");
    redirect("/"); // Replace with your redirect logic
  } else {
    console.log("Active session found:", session);
  } 
    const { data: { user } } = await supabase.auth.getUser()

    const { data: userDetails, error } = await supabase
    .from('profiles')
    .select('id, full_name, patronym, email, phone, number_id')
    .eq('id', 2)
    .single(); //giati perimeno 1 row

    const userData = { id: userDetails?.id, full_name: userDetails?.full_name, patronym: userDetails?.patronym, 
      email: userDetails?.email, phone: userDetails?.phone, number_id: userDetails?.number_id}

    return userData 
  } */

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    updateCurrentProfile(values.name, values.patronym, values.email, values.phone,
      values.number_id
    );


    
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Προσωπικά Στοιχεία</h2>
      <Form {...form}>
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ονοματεπώνυμο</FormLabel>
          <FormControl>
            <Input placeholder="πχ Μιχάλης Αγγελετόπουλος" {...form.register('name')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="patronym"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Πατρώνυμο</FormLabel>
          <FormControl>
            <Input placeholder="πχ Παναγιώτης" {...form.register('patronym')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="πχ example@gmail.com" {...form.register('email')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Τηλέφωνο</FormLabel>
          <FormControl>
            <Input placeholder="πχ 6912345678" {...form.register('phone')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="number_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Αριθμός Ταυτότητας</FormLabel>
          <FormControl>
            <Input placeholder="πχ ΑΨ 1234" {...form.register('number_id')} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  
      <Button type="submit">Ενημέρωση στοιχείων</Button>
        
      </form>
      </Form>
    </div>
  );
}

export default Page 

/*
"use server";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import ClientForm from "./ClientForm";

const Page = async () => {
  const supabase = createClient();
  

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null; // Ensures a redirect if no user is authenticated
  }

  const { data: userDetails } = await supabase
    .from("profiles")
    .select("id, full_name, patronym, email, phone, number_id")
    .eq("id", user.id)
    .single();

  // Pass userDetails to the client-side form
  return <ClientForm userDetails={userDetails} />;
};

export default Page;
*/
