"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";


import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = createClient();

  const dataaaa = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(dataaaa);

  if (error) {
    redirect("/login?wrong_PassEmail=true");
  }
  cookies().set('sb-access-token', data.session?.access_token || '');

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      console.log("Ο χρήστης δεν είναι επαληθευμένος ή είναι αδύνατη η ανάκτηση των στοιχείων του");
      redirect("/");  
  }
  else {
    console.log(user);
  }

/*
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
  } */

  var role;
  const { data: da , error: errorus } = await supabase.auth.getUser()
  if (errorus || !da?.user) {
    role = "user";
  }
  else {
    const { data: userDetails, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', da.user.id)
      .single();
    
    if (userDetails?.role == "admin") {
      role = "admin";
    }
    else if (userDetails?.role == "officer") {
      role = "officer";
    }
    else if (userDetails?.role == "user") {
      role = "user";
    }
  } 
 
  if (role=="admin") {
    revalidatePath("./", "layout");
    redirect("./dash_proxeiro");
  }
  if (role=="officer") {
    revalidatePath("./", "layout");
    redirect("./offi_forms");
  }
  if (role=="user") {
    revalidatePath("./", "layout");
    redirect("./");
  }

}

export async function resetPassword(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset_password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login?verifyAccount=wrong");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/logout", "layout");
  redirect("../../logout");
  
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath(data.url, "layout");
  redirect(data.url);
/*
 var role;
 const { data: da , error: errorus } = await supabase.auth.getUser()
 if (errorus || !da?.user) {
   role = "user";
 }
 else {
   const { data: userDetails, error } = await supabase
     .from('profiles')
     .select('id, role')
     .eq('id', da.user.id)
     .single();
   
   if (userDetails?.role == "admin") {
     role = "admin";
   }
   else if (userDetails?.role == "officer") {
     role = "officer";
   }
   else if (userDetails?.role == "user") {
     role = "user";
   }
 } 
 console.log(role);

 if (role=="admin") {
  console.log("1");
   revalidatePath("./", "layout");
   redirect("./dash_proxeiro");
 }
 if (role=="officer") {
  console.log("2");
   revalidatePath("./", "layout");
   redirect("./offi_forms");
 }
 if (role=="user") {
  console.log("3");
   revalidatePath("./", "layout");
   redirect("./");
 }*/

}

export async function redirectingLoginSuccess() {
  revalidatePath("/login", "layout");
  redirect("./login?reset=success");
  
}
