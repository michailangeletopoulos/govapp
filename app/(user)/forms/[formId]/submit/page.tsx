"use client";

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { getCurrentProfile, getFormDetails, insertUserForm } from '@/app/(user)/user_details/getProfile';
//import FileUpload from '../../FileUpload';
import { createClient } from "@/utils/supabase/client";

interface FormSubmissionPageProps {
  params: { formId: string }
}

type FormField = {
  id: string;
  label: string;
  //type: 'text' | 'number' | 'email' | 'file';
  type: string;
  example: string;
}

type UserProfile = {
  //[key: string]: string | number | undefined;
  id: string;
  full_name: string;
  role: string;
  patronym: string;
  email: string;
  phone: number;
  number_id: string;
}
type FormData = {
  [key: string]: string | number | File;
}

const predefinedFields = [
  { id: 'email', label: 'Email', type: 'text', example: 'example@gmail.com' },
  { id: 'patronym', label: 'Πατρώνυμο', type: 'text', example: 'Παναγιώτης' },
  { id: 'full_name', label: 'Ονοματεπώνυμο', type: 'text', example: 'Μιχαήλ Αγγελετόπουλος' },
  { id: 'phone', label: 'Αριθμός Τηλεφώνου', type: 'text', example: '6912345678' },
  { id: 'number_id', label: 'Αριθμός Ταυτότητας', type: 'text', example: 'ΑΤ1234' },
]

export default function FormSubmissionPage({ params: { formId } }: FormSubmissionPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<{ title: string; context: string; fields: FormField[] } | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const formSchema = z.object({}).catchall(z.union([z.string().min(1, "Αυτό το πεδίο πρέπει να συμπληρωθεί"), 
    z.number().min(1, "Αυτό το πεδίο πρέπει να συμπληρωθεί"), z.instanceof(File, { message: "Αυτό το πεδίο πρέπει να συμπληρωθεί" })]))

  const formMethods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const { control, setValue, watch } = formMethods

  useEffect(() => {
      isUserLog()
    }, [])
  
  const isUserLog = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login?need_logIn=true")
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [userData, formData] = await Promise.all([
        getCurrentProfile(),
        getFormDetails(parseInt(formId))
      ])

      setUserProfile(userData)
      setForm(formData)

      if (formData && formData.fields) {
        const defaultValues: FormData = {}

        formData.fields.forEach((field: { id: string; }) => {
          defaultValues[field.id] = ''

          const isPredefined = predefinedFields.some(predefField => predefField.id === field.id)
          if (isPredefined && userData && userData[field.id as keyof UserProfile] !== undefined) {
            defaultValues[field.id] = userData[field.id as keyof UserProfile]
            setValue(field.id, userData[field.id as keyof UserProfile])
          }
        })

        formMethods.reset(defaultValues)
      }

      setLoading(false)
    }

    fetchData()
  }, [formId, setValue, formMethods])


  if (loading) {
    return <div>Loading...</div>
  }

  async function onSubmit(values: FormData) {

    await insertUserForm(
      form ? form.title : 'Unknown Form',
      values
    )
    router.push("/categories")
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>{form ? form.title : 'Form Submission'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
            {form && form.fields.map((field) => {
              const isPredefined = predefinedFields.some(predefField => predefField.id === field.id)
              return (
                <FormField
                  key={field.id}
                  control={control}
                  name={field.id}
                  render={({ field: formField }) => (
                    <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'file' ? (
                        <Input 
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setValue(field.id, file)
                            }
                          }}
                        />
                      ) : (
                        <Input 
                          {...formField} 
                          type={field.type}
                          placeholder={field.example}
                          disabled={isPredefined && userProfile ? userProfile[field.id as keyof UserProfile] !== undefined : undefined}
                          value={formField.value as string | number | undefined}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              )
            })}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push(`/forms/${formId}`)}>
          Επιστροφή
        </Button>
        <Button type="submit" onClick={formMethods.handleSubmit(onSubmit)}>
          Ολοκλήρωση
        </Button>
      </CardFooter>
    </Card>
  )

}

