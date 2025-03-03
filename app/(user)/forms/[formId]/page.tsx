"use client";

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { getFormDetails } from '../../user_details/getProfile'

interface FormPageProps {
  params: { formId: string }
}

type Form = {
  title: string
  context: string
}

export default function FormPage({ params: { formId } }: FormPageProps) {
  const router = useRouter()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getForm()
  }, [])

  const getForm = async () => {
    const form = await getFormDetails(parseInt(formId))
    setForm(form || null)
    setLoading(false)
  }

  const goToSubmissionPage = () => {
    router.push(`/forms/${formId}/submit`)
  }

  if (loading) {
    return <div>Φόρτωση...</div>
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>{form ? form.title : 'Form not found'}</CardTitle>
        <CardDescription>Περιγραφή</CardDescription>
      </CardHeader>
      <CardContent>
      <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: form?.context || ""}}  
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/categories")}>
          Κατηγορίες
        </Button>
        <Button onClick={goToSubmissionPage}>Συμπλήρωση Φόρμας</Button>
      </CardFooter>
    </Card>
  )
}

