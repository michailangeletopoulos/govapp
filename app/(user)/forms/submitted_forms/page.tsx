import { createClient } from "@/utils/supabase/server";
import UserFormList from './list'

export default async function UserFormsPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view this page.</div>
  }

  const { data: forms, error } = await supabase
    .from('users_forms')
    .select('*')
    .eq('full_name', user.user_metadata.full_name)

  if (error) {
    console.error('Error fetching forms:', error)
    return <div>Error loading forms. Please try again later.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Submitted Forms</h1>
      <UserFormList forms={forms || []} />
    </div>
  )
}