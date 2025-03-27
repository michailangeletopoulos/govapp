import { createClient } from "@/utils/supabase/server"
import UserFormList from "./list"
import { redirect } from "next/navigation"

export default async function UserFormsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?need_logIn=true")
  }

  const { data: userSubmissions, error: submissionsError } = await supabase
    .from("user_form_submissions")
    .select("*")
    .eq("user_id", user.id)

    const { data: forms, error: formsError } = await supabase.from("form").select("id, title, category")
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, category")

  if (submissionsError || formsError || categoriesError) {
    console.error("Σφάλμα στην φόρτωση δεδομένων:", submissionsError || formsError || categoriesError)
    return <div>Σφάλμα στην φόρτωση δεδομένων, προσπαθήστε αργότερα</div>
  }

  const combinedForms =
    userSubmissions?.map((submission) => {
      const matchingForm = forms?.find((form) => form.title === submission.formTitle)
      return {
        ...submission,
        category: matchingForm?.category || "Άγνωστη",
      }
    }) || []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Υποβληθείσες φόρμες</h1>
      <UserFormList forms={combinedForms} categories={categories || []} />
    </div>
  )
}

