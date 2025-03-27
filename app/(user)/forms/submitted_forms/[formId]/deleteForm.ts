"use server";

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteForm(formId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("user_form_submissions").delete().eq("id", formId)

  if (error) {
    console.error("Σφάλμα διαγραφής φόρμας:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("../forms")
  return { success: true }
}

