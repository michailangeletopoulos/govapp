import { createClient } from "@/utils/supabase/server"
import UserFormList from "./list"
import { redirect } from "next/navigation"

export default async function OfficerFormsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?need_logIn=true")
  }

  const { data: officerSubmissions, error: submissionsError } = await supabase
    .from("user_form_submissions")
    .select("*")
    .eq("officer_id", user.id)

  const { data: forms, error: formsError } = await supabase.from("form").select("id, title, category")

  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, category")

  if (submissionsError || formsError || categoriesError) {
    console.error("Σφάλμα ανάκτησης δεδομένων:", submissionsError || formsError || categoriesError)
    return <div>Σφάλμα στην φόρτωση των φορμών.</div>
  }

  const combinedForms =
    officerSubmissions?.map((submission) => {
      const matchingForm = forms?.find((form) => form.title === submission.formTitle)
      return {
        ...submission,
        category: matchingForm?.category || "Άγνωστη",
      }
    }) || []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Φόρμες που διαχειρίζομαι</h1>
      <UserFormList forms={combinedForms} categories={categories || []} />
    </div>
  )
}

