import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { createClient } from "@/utils/supabase/server"
import ChatComponent from '@/app/(user)/forms/submitted_forms/[formId]/ChatComponent';
import FormDetails from '@/app/(user)/forms/submitted_forms/[formId]/FormDetails';
import SetFormAsDoneButton from '../SetFormAsDoneButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getProfileRoleServer } from '@/app/(user)/user_details/getProfileServer';

export default async function FormPage({ params }: { params: { formId: string } }) {
  const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      redirect("/login?need_logIn=true")
    }
    const role = await getProfileRoleServer();
      
      console.log(role);
      
      if (role == "user") {
        redirect("./");
      }

  const { data: submission, error: submissionError } = await supabase
    .from('user_form_submissions')
    .select('*')
    .eq('id', params.formId)
    .single()

  if (submissionError) {
    console.error('Error Δεν υπάρχει φόρμα με τέτοιο id, το error είναι:', submissionError)
    return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
    <Alert className="mb-4 max-w-sm">
          <AlertDescription>
            Δεν υπάρχει φόρμα με τέτοιο id
          </AlertDescription>
        </Alert>
    </div>
    )
  }

  const { data: name, error: nameError } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', submission.officer_id)
    .single()

  if (nameError) {
    console.error('Δεν βρέθηκε officer name:', submissionError)
    return <div>Σφάλμα φόρτωσης φόρμας</div>
  }

  const { data: formDefinition, error: formError } = await supabase
    .from('form')
    .select('fields')
    .eq('title', submission.formTitle)
    .single()

  if (formError) {
    console.error('Σφάλμα φόρτωσης φόρμας:', formError)
    return <div>Σφάλμα φόρτωσης φόρμας</div>
  }

  const form = {
    ...submission,
    fields: formDefinition.fields,
    id: submission.id
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Λεπτομέρειες Φόρμας</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-6">

        <div>
          <h2 className="text-xl font-semibold mb-2">Ημ/νία Υποβολής</h2>
          <p className="text-gray-700">{submission.created_at}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Κατάσταση</h2>
          <p className="text-gray-700">{submission.done ? "Απαντημένο αίτημα" : "Σε εξέλιξη"}</p>
        </div>
      </div>
      <FormDetails form={form} userId={user.id}/>
      <div className="flex justify-start mt-6 space-x-4">
        {!submission.done && <SetFormAsDoneButton formId={params.formId} />}
      </div>
    </div>
  )
}