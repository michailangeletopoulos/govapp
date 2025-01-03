import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import FormDetails from './FormDetails'
import ChatComponent from './ChatComponent'
import { createClient } from "@/utils/supabase/server"

export default async function FormPage({ params }: { params: { formId: string } }) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view this page.</div>
  }

  const { data: form, error } = await supabase
    .from('users_forms')
    .select('*')
    .eq('id', params.formId)
    .single()

  if (error || !form) {
    console.error('Error fetching form:', error)
    return notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Λεπτομέρειες Φόρμας</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDetails form={form} />
        <ChatComponent formId={form.id} userId={user.id} />
      </div>
    </div>
  )
}