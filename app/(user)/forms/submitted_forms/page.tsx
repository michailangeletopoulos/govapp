import { createClient } from "@/utils/supabase/server";
import UserFormList from './list'
import { redirect } from "next/navigation";

export default async function UserFormsPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?need_logIn=true")
  }

  const { data: forms, error } = await supabase
    .from('user_form_submissions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching forms:', error)
    return <div>Error στην φόρτωση φορμών, προσπαθήστε αργότερα</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Υποβληθείσες φόρμες</h1>
      <UserFormList forms={forms || []} />
    </div>
  )
}