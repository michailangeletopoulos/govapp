"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateEmail(prevState: any, formData: FormData) {
    const newEmail = formData.get('email') as string
  
    if (!newEmail) {
      return { error: 'Email is required' }
    }

    const supabase = createClient();
  
    const { data, error } = await supabase.auth.updateUser({ email: newEmail })
  
    if (error) {
      return { error: error.message }
    }
  
    return { success: 'Email update initiated. Please check your new email for verification.' }
  }
