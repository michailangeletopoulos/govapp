"use server";

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function setFormAsDone(formId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("user_form_submissions").update({ done: true }).eq("id", formId)

  if (error) {
    console.error("Error updating form status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/forms/${formId}`)
  return { success: true }
}

