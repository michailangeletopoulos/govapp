import { createClient } from "@/utils/supabase/server";
import AdminFormList from './list'

export default async function AdminFormsPage() {
  const supabase = createClient();
  
  const { data: forms, error: formsError } = await supabase
    .from('users_forms')
    .select('*')
    .is('officer_id', null)

  const { data: officers, error: officersError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'officer')

  if (formsError || officersError) {
    console.error('Error fetching data:', formsError || officersError)
    return <div>Error loading forms. Please try again later.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Forms Dashboard</h1>
      <AdminFormList forms={forms || []} officers={officers || []} />
    </div>
  )
}