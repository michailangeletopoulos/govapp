"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";


import { cookies } from "next/headers";
import { getProfileRole } from "@/app/(user)/user_details/getProfile";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataaaa = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(dataaaa);

  if (error) {
    redirect("/error");
  }
  cookies().set('sb-access-token', data.session?.access_token || '');

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      console.log("User is not authenticated or data is unavailable.");
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

 const role = await getProfileRole();

  if (role=="admin") {
    revalidatePath("./", "layout");
    redirect("./dashboard");
  }
  else {
    revalidatePath("/", "layout");
    redirect("/");
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
  redirect("/login");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
  
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

  redirect(data.url);
}
