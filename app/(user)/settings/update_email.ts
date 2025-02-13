"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateEmail(prevState: any, formData: FormData) {
    const newEmail = formData.get('email') as string
  
    if (!newEmail) {
      return { error: 'Το email είναι υποχρεωτικό' }
    }

    const supabase = createClient();
  
    const { data, error } = await supabase.auth.updateUser({ email: newEmail })
  
    if (error) {
      return { error: "Υπάρχει ήδη χρήστης με αυτό το email" }
    }
  
    return { success: 'Επιτυχής αίτηση ενημέρωσης email. Παρακαλώ επιβεβαιώστε την αλλαγή και από τα 2 email σας' }
  }
